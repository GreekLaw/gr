 //void function(){
actions = { checked:   checked,
            shown:     shown,
            concealed: concealed,
            disabled:  disabled
          }
ac = { controls: controls }

function controls(event){
	var actor
	actor = event.target
	while (actor.getAttribute('data-controls') === null && actor !== document.documentElement){
		actor = actor.parentNode
	}
	if (actor.tagName.toLowerCase() === 'button' && actor.getAttribute('aria-pressed') !== null){
		document.getElementById(actor.getAttribute('data-controls')).checked =
		!document.getElementById(actor.getAttribute('data-controls')).checked
		return
	}
	if (actor.tagName.toLowerCase() === 'button' && actor.getAttribute('aria-pressed') === null){
		document.getElementById(actor.getAttribute('data-controls')).checked = true
	}
	if (actor.tagName.toLowerCase() === 'button' && actor.parentNode.getAttribute('aria-haspopup') !== null){

		actor.parentNode.getAttribute('aria-expanded') === 'true'   ?
			actor.parentNode.setAttribute('aria-expanded', 'false')  :
		actor.parentNode.getAttribute('aria-expanded') === 'false'  ?
			actor.parentNode.setAttribute('aria-expanded', 'true')	 :
			void Function
	}
}

void function disableForms(){
	var i, forms

	forms = document.getElementsByTagName('form')
	for (i = 0; i < forms.length; i++){
		if (forms[i].getAttribute('action') === null){
			forms[i].onsubmit = preventEvent
		}
	}

}()

function preventEvent(event){
	event.preventDefault()
	return false
}

var actions, action, actors, actor, i
actors = []
for (action in actions){

	actorsWithAction = getArrayFromNodeList(document.querySelectorAll('[data-' + action + ']'))
	for (i = 0; i < actorsWithAction.length; i++){
		var actor

		actor = actorsWithAction[i]
		actors[i] === undefined                                ? actors.push( { element: actor, actions: [ { verb: actions[action], triggers: getTriggers(action, actor) } ] } ) :
		actors[i] !== undefined && actors[i].element === actor ? actors[i].actions.push( { verb: actions[action], triggers: getTriggers(action, actor) } )			             :
		actors[i] !== undefined && actors[i].element !== actor ? actors.push( { element: actor, actions: [ { verb: actions[action], triggers: getTriggers(action, actor) } ] } ) :
		                                                         void Function

	}
}

function getTriggers(action, actor){
	var triggers, triggerString, triggersStrings, i, conditions, k, conditionParts, conditionFlag, conditionTerm, condition

	triggers = []

	triggersString = actor.getAttribute('data-' + action)
	triggerStrings = triggersString.replace(/\s+/g, ' ').replace(/^\s|\s$/g,'').split(/\s/g)
	for (i = 0; i < triggerStrings.length; i++){
		triggers[i] = []
		conditions = triggerStrings[i].split(/(?=[+-])/g)
		for (k = 0; k < conditions.length; k++){
			conditionParts = conditions[k].split(/(?=[+-])|(?=if\d+)/g)
			conditionFlag  = conditionParts[0] === '+' ? true  :
			                 conditionParts[0] === '-' ? false :
			                                             true

			conditionTerm = /if\d+/.test(conditionParts[0]) ? conditionParts[0] :
			                /if\d+/.test(conditionParts[1]) ? conditionParts[1] :
			                                                  null
			condition     = { flag: conditionFlag,
			                  term: conditionTerm
			                }
			triggers[i].push(condition)
		}
	}
	return triggers
}

// actor -> actions -> triggers -> conditions

document.onreadystatechange = applyAddressBarParameters
document.onclick = refreshState

function applyAddressBarParameters(){
	var act, actorsWithAct, i, parametersString, parameters, element

	for (act in ac){
		actorsWithAct = getArrayFromNodeList(document.querySelectorAll('[data-' + act + ']'))
		for (i = 0; i < actorsWithAct.length; i++){
			actorsWithAct[i].onclick = ac[act]
		}
	}

	if (document.readyState === 'interactive' || document.readyState === 'complete'){
		parametersString = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
		parameters       = parametersString.split(',')

		if (parameters.length === 1 && parameters[0] === '') { return refreshState() }
		for (i = 0; i < parameters.length; i++){
			element = document.querySelector('.' + parameters[i])
			element && !element.checked ? element.checked = true : 
			                              void Function
		}
	}

	refreshState()
}

function refreshState(event){
	var i, actor, k, action, result, m, triggerValidity, result

	for (i = 0; i < actors.length; i++){
		actor = actors[i]
		for (k = 0; k < actor.actions.length; k++){
			action = actor.actions[k]
			result = false
			for (m = 0; m < action.triggers.length; m++){
				triggerValidity = verifyTrigger(action.triggers[m])
				result = result || triggerValidity
			}
			action.verb(actor.element, result, event)
		}
	}
}

function verifyTrigger(trigger){
	var result, i, condition

	result = true

	for (i = 0; i < trigger.length; i++){
		condition = trigger[i]
		result = result && verifyCondition(condition)
	}

	return result
 }

function verifyCondition(condition){
	return condition.flag ? document.getElementById(condition.term).checked : !document.getElementById(condition.term).checked
}

function shown(actor, value, event){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?shown(?:\s|$))/g    , 'shown '    )
	                                         .replace(/(^|\s)not-shown(\s|$)/g          , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-shown(?:\s|$))/g, 'not-shown ')
	                                         .replace(/(^|\s)shown(\s|$)/g              , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         )
}

function checked(actor, value, event){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?checked(?:\s|$))/g    , 'checked '    )
	                                         .replace(/(^|\s)not-checked(\s|$)/g          , '$1$2'         )
	                                         .replace(/\s+/g                              , ' '            ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-checked(?:\s|$))/g, 'not-checked ')
	                                         .replace(/(^|\s)checked(\s|$)/g              , '$1$2'         )
	                                         .replace(/\s+/g                              , ' '            )

	if (actor.tagName.toLowerCase() === 'button' && actor.getAttribute('aria-pressed')){
		actor.getAttribute('aria-pressed') === 'true'  ? actor.setAttribute('aria-pressed', 'false') :
		actor.getAttribute('aria-pressed') === 'false' ? actor.setAttribute('aria-pressed', 'true' ) :
		actor.getAttribute('aria-pressed')             ? actor.setAttribute('aria-pressed', 'false') :
		                                                 void Function 
	}
}

function concealed(actor, value, event){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?concealed(?:\s|$))/g    , 'concealed '    )
	                                         .replace(/(^|\s)not-concealed(\s|$)/g          , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-concealed(?:\s|$))/g, 'not-concealed ')
	                                         .replace(/(^|\s)concealed(\s|$)/g              , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             )
}

function disabled(actor, value, event){
	value ? actor.setAttribute('aria-disabled', true) : actor.removeAttribute('aria-disabled')
}

function getArrayFromNodeList(nodeList){
	var result, i

	result = []
	for (i = 0; i < nodeList.length; i++){
		result.push(nodeList[i])
	}

	return result
}

function refreshActorState(actor){
	var actions, action

	actions = getActions(actor)
	for (action in actions){
		verifyTrigger
	}
}

/*
HIGH LEVEL IMPLEMENTATION TARGETS
1. data-show=if1 implies data-hide=default
To achieve this, pass the cost of mutual exclusivity to the programming side.
This show function will hide the element if the condition is false.
Another show function could arise that would not show this behavior
2. data-show=if1 data-hide=if2 can be resolved
when both if1 is true and if2 is true
It's a programming error to both show and hide an element at the same time, whatever the conditions.
So The programmer should redesign his scenario, instead of expecting the language to get this out if the way.
In fact, this can always be resolved through more complex logic statements instead of more complex behavior.
Turn the above to data-show="+if1-if5". Now it's hidden if1 is true and if5 is false
This will never happen so long as actions are atomic. That is, each action acts on a different property of the element.
This can be avoided by moving the complexity to the programmers side of things.
Let the show function default to not showing if false, then no problem exists.
In fact, this should go away if data-show reverts to not showing, and data-hide just reinforces not showing.
3. Implement levels or not
do-show = "if1 lvl3(if4)"is equivalent to "if1-if4"
So, there's no need to implement levels
Pass the responsibility to the logic programmer 
4. Semantic variable names or abstract logic names
With logic names, copy pasting structures from one problem to the other is easier.
More importantly, reaching the correct structure of the logic tree is easier to get to if thinking abstractly.
5. Support passing parameters in functions
Parameters are handled by curried functions.
A parameter is the result of a function passed onto the main function.
programming language:
iterators of arrays and objects should be the same
iterating over an object's properties should return the value of the properties, not the key.
iterating over an array should iterate over the array members, not the indexes
for each action in actions {}
actions can be an array or an an object
instead, in JS, you need to do
for (i = 0; i < actions.length; i++){actions[i] =3} // for arrays
for (action in actions){actions[action] = 3} // for objects
*/
//}
