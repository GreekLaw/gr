//void function(){
var actors, actions, acts

actors  = []
actions = { 'checked-if':   checked,
            'shown-if':     shown,
            'concealed-if': concealed,
            'disabled-if':  disabled
          }
acts    = { controls: controls }

document.onreadystatechange = applyAddressBarParameters
document.onclick            = refreshState

void function disableForms(){
	var forms, i

	forms = document.getElementsByTagName('form')
	for (i = 0; i < forms.length; i++){
		if (forms[i].getAttribute('action') === null){
			forms[i].onsubmit = preventEvent
		}
	}
}()

void createActorsList()

function createActorsList(){
	var action, i, actor

	 for (action in actions){
		actorsWithAction = getArrayFromNodeList(document.querySelectorAll('[data-' + action + ']'))

		for (i = 0; i < actorsWithAction.length; i++){
			actor = actorsWithAction[i]
			actors[i] === undefined                                ? actors.push( { element: actor, actions: [ { verb: actions[action], triggers: getTriggers(action, actor) } ] } ) :
			actors[i] !== undefined && actors[i].element === actor ? actors[i].actions.push( { verb: actions[action], triggers: getTriggers(action, actor) } )			             :
			actors[i] !== undefined && actors[i].element !== actor ? actors.push( { element: actor, actions: [ { verb: actions[action], triggers: getTriggers(action, actor) } ] } ) :
			                                                         void Function

		}
	}
}

function getTriggers(action, actor){
	var triggers, triggersString, triggerStrings, i, conditions, k, conditionParts, conditionFlag, conditionTerm, condition

	triggers = []

	triggersString = actor.getAttribute('data-' + action)
	triggerStrings = triggersString.replace(/\s+/g, ' ').replace(/^\s|\s$/g,'').split(/\s/g)
	for (i = 0; i < triggerStrings.length; i++){
		triggers[i] = []
		conditions = triggerStrings[i].split(/(?=[+-])/g)
		for (k = 0; k < conditions.length; k++){
			conditionParts = conditions[k].match(/[+-]|.+/g)
			conditionFlag  = conditionParts[0] === '+' ? true  :
			                 conditionParts[0] === '-' ? false :
			                                             true

			conditionTerm = /\d+/.test(conditionParts[0]) ? conditionParts[0] :
			                /\d+/.test(conditionParts[1]) ? conditionParts[1] :
			                                                null
			condition     = { flag: conditionFlag,
			                  term: conditionTerm
			                }
			triggers[i].push(condition)
		}
	}
	return triggers
}

function verifyTrigger(trigger, action, actor){
	var result, i, condition

	result = true

	for (i = 0; i < trigger.length; i++){
		condition = trigger[i]
		result    = result && verifyCondition(condition, trigger, action, actor)
	}

	return result
 }

function verifyCondition(condition, trigger, action, actor){
	var validTerm, term, conditionElement, validElement, conditionTruth

	validTerm        = condition.term !== null
	term             = 'if' + condition.term
	conditionElement = document.getElementById(term)
	validElement     = conditionElement !== null

	if (!validTerm   ){ return (logTermError(condition, trigger, action, actor)   , false) }
	if (!validElement){ return (logElementError(condition, trigger, action, actor), false) }

	conditionTruth =  condition.flag ?  conditionElement.checked :
	                 !condition.flag ? !conditionElement.checked :
	                                    false

	return conditionTruth
}

function logTermError(condition, trigger, action, actor){
	var invalidTermError, actorIndex, actionIndex, triggerIndex

	actorIndex   = getIndexInArray(actors, actor)
	actionIndex  = getIndexInArray(actor.actions, action)
	triggerIndex = getIndexInArray(action.triggers, trigger)

	invalidTermError = 'There is an error with an actor\'s term. \nTo locate actor: actors[' + 
	actorIndex + '].element \nTo locate action: actors[' + actorIndex + '].actions[' + 
	actionIndex + '].verb \nTo locate trigger: actors[' + actorIndex + '].actions[' + 
	actionIndex + '].triggers[' + triggerIndex + ']'

	console && console.log(invalidTermError)
}

function logElementError(condition, trigger, action, actor){
	var invalidElementError, actorIndex, actionIndex, triggerIndex


	actorIndex   = getIndexInArray(actors, actor)
	actionIndex  = getIndexInArray(actor.actions, action)
	triggerIndex = getIndexInArray(action.triggers, trigger)

	invalidElementError = 'Can not locate actor with id if' +
	                       condition.term + '.\nTo locate requesting actor: actors[' + 
	actorIndex + '].element \nTo locate requesting action: actors[' + actorIndex + '].actions[' + 
	actionIndex + '].verb \nTo locate requesting trigger: actors[' + actorIndex + '].actions[' + 
	actionIndex + '].triggers[' + triggerIndex + ']'

	console && console.log(invalidElementError)
}

function getIndexInArray(array, member){
	var i

	for (i = 0; i < array.length; i++){
		if (array[i] === member) { break }
	}

	return i
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
	                                         .replace(/(^|\s)not-checked(\s|$)/g          , '$1$2'        )
	                                         .replace(/\s+/g                              , ' '           ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-checked(?:\s|$))/g, 'not-checked ')
	                                         .replace(/(^|\s)checked(\s|$)/g              , '$1$2'        )
	                                         .replace(/\s+/g                              , ' '           )

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

		actor.parentNode.getAttribute('aria-expanded') === 'true'  ? actor.parentNode.setAttribute('aria-expanded', 'false') :
		actor.parentNode.getAttribute('aria-expanded') === 'false' ? actor.parentNode.setAttribute('aria-expanded', 'true')  :
		                                                             void Function
	}
}

function refreshState(event){
	var i, actor, k, action, result, m, triggerValidity, result

	for (i = 0; i < actors.length; i++){
		actor = actors[i]
		for (k = 0; k < actor.actions.length; k++){
			action = actor.actions[k]
			result = false
			for (m = 0; m < action.triggers.length; m++){
				triggerValidity = verifyTrigger(action.triggers[m], action, actor)
				result = result || triggerValidity
			}
			action.verb(actor.element, result, event)
		}
	}
}

function refreshActorState(actor){
	var actions, action

	actions = getActions(actor)
	for (action in actions){
		verifyTrigger
	}
}

function applyAddressBarParameters(){
	var act, actorsWithAct, i, parametersString, parameters, element

	for (act in acts){
		actorsWithAct = getArrayFromNodeList(document.querySelectorAll('[data-' + act + ']'))
		for (i = 0; i < actorsWithAct.length; i++){
			actorsWithAct[i].onclick = acts[act]
		}
	}

	if (document.readyState === 'interactive' || document.readyState === 'complete'){
		parametersString = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
		parameters       = parametersString.split(',')

		if (parameters.length === 1 && parameters[0] === '') { return refreshState() }
		for (i = 0; i < parameters.length; i++){
			element = document.querySelector('[value=' + parameters[i] + ']')
			element && !element.checked ? element.checked = true : 
			                              void Function
		}
	}

	refreshState()
}

function getArrayFromNodeList(nodeList){
	var result, i

	result = []
	for (i = 0; i < nodeList.length; i++){
		result.push(nodeList[i])
	}

	return result
}

function preventEvent(event){
	event.preventDefault()
	return false
}

//}
