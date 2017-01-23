//void function(){
var actors, actions, acts

actors  = []
state   = {    'controls':    controls }
actions = {  'checked-if':   checkedIf,
               'shown-if':     shownIf,
           'concealed-if': concealedIf,
            'disabled-if':  disabledIf
          }

document.onreadystatechange = applyAddressBarParametersToView
document.onclick            = applyInterfaceToView

void disableForms()
void conveyStageDirections()

// [ sequence part 1,
//  [sequence part 2 option 1, sequence part2 option 2],
//   sequence part 2 reference
// ]

function applyAddressBarParametersToView(){
	applyAddressBarParametersToState()
	applyStateToView()
}

function applyInterfaceToView(event){
	applyInterfaceToState(event)
	applyStateToView(event)
}

function applyAddressBarParametersToState(){
	var parametersString, parameters, i, element 

	if (document.readyState === 'interactive' || document.readyState === 'complete'){
		parametersString = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
		parameters       = parametersString.split(',')

		if (parameters.length === 1 && parameters[0] === '') { return }

		for (i = 0; i < parameters.length; i++){
			element = document.querySelector('[value=' + parameters[i] + ']')
			element && !element.checked ? element.checked = true : 
			                              void Function
		}
	}
}

function applyInterfaceToState(event){
	var stateControls, i, actor, result

	stateControls = document.querySelectorAll('[data-controls]')
	for (i = 0; i < stateControls.length; i++){
		actor = stateControls[i]
		result = true
		controls(actor, result, event)
	}
}

function applyStateToView(event){
	var i, actor, k, action, result, m, cueValidity, result

	for (i = 0; i < actors.length; i++){
		actor = actors[i]
		for (k = 0; k < actor.actions.length; k++){
			action = actor.actions[k]
			result = false
			for (m = 0; m < action.cues.length; m++){
				cueValidity = verifyCue(action.cues[m], action, actor)
				result = result || cueValidity
			}
			action.verb(actor.element, result, event)
		}
	}
}

function disableForms(){
	var forms, i

	forms = document.getElementsByTagName('form')
	for (i = 0; i < forms.length; i++){
		forms[i].getAttribute('action') === null ? forms[i].onsubmit = preventEvent :
		                                           void Function
	}
}

function conveyStageDirections(){
	var action, actorsWithAction, i, actor

	 for (action in actions){
		actorsWithAction = getArrayFromNodeList(document.querySelectorAll('[data-' + action + ']'))

		for (i = 0; i < actorsWithAction.length; i++){
			actor = actorsWithAction[i]
			actors[i] === undefined                                ? actors.push( { element: actor, actions: [ { verb: actions[action], cues: getCues(action, actor) } ] } ) :
			actors[i] !== undefined && actors[i].element === actor ? actors[i].actions.push( { verb: actions[action], cues: getCues(action, actor) } )			             :
			actors[i] !== undefined && actors[i].element !== actor ? actors.push( { element: actor, actions: [ { verb: actions[action], cues: getCues(action, actor) } ] } ) :
			                                                         void Function
		}
	}
}

function getCues(action, actor){
	var cues, cuesString, cueStrings, i, conditions, k, conditionParts, conditionFlag, conditionTerm, condition

	cues = []

	cuesString = actor.getAttribute('data-' + action)
	cueStrings = cuesString.replace(/\s+/g, ' ').replace(/^\s|\s$/g,'').split(/\s/g)
	for (i = 0; i < cueStrings.length; i++){
		cues[i] = []
		conditions = cueStrings[i].split(/(?=[+-])/g)
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
			cues[i].push(condition)
		}
	}
	return cues
}

function getTerm(termInCondition, action){
	var term

	term = action === controls ?        termInCondition : 
	                             'if' + termInCondition

	return term
}

function verifyCue(cue, action, actor){
	var result, i, condition

	result = true

	for (i = 0; i < cue.length; i++){
		condition = cue[i]
		result    = result && verifyCondition(condition, cue, action, actor)
	}

	return result
 }

function verifyCondition(condition, cue, action, actor){
	var validTerm, term, conditionElement, validElement, conditionTruth

	validTerm        = condition.term !== null
	term             = getTerm(condition.term, action.verb)
	conditionElement = document.getElementById(term)
	validElement     = conditionElement !== null

	if (!validTerm   ){ return (logTermError(condition, cue, action, actor)   , false) }
	if (!validElement){ return (logElementError(condition, cue, action, actor), false) }

	conditionTruth =  condition.flag ?  conditionElement.checked :
	                 !condition.flag ? !conditionElement.checked :
	                                    false

	return conditionTruth
}

function logTermError(condition, cue, action, actor){
	var actorIndex, actionIndex, cueIndex

	actorIndex  = getIndexInArray(actors, actor)
	actionIndex = getIndexInArray(actor.actions, action)
	cueIndex    = getIndexInArray(action.cues, cue)

	console &&
	console.log.apply(null,
		              ['There is an error with an actor\'s term', '\n',
	                   'The actor is '  , actors[actorIndex].element, '\n',
	                   'The action is ' , actors[actorIndex].actions[actionIndex].verb, '\n',
	                   'The cue is ', actors[actorIndex].actions[actionIndex].cues[cueIndex], '\n'
	                  ])
}

function logElementError(condition, cue, action, actor){
	var actorIndex, actionIndex, cueIndex

	actorIndex  = getIndexInArray(actors, actor)
	actionIndex = getIndexInArray(actor.actions, action)
	cueIndex    = getIndexInArray(action.cues, cue)

	console &&
	console.log.apply(null,
		                ['Can not locate actor with id ', condition.term, '\n',
	                         'The requesting actor is '  , actors[actorIndex].element, '\n',
	                         'The requesting action is ' , actors[actorIndex].actions[actionIndex].verb, '\n',
	                         'The requesting cue is ', actors[actorIndex].actions[actionIndex].cues[cueIndex], '\n'
	                        ])
}

function shownIf(actor, value, event){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?shown(?:\s|$))/g    , 'shown '    )
	                                         .replace(/(^|\s)not-shown(\s|$)/g          , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-shown(?:\s|$))/g, 'not-shown ')
	                                         .replace(/(^|\s)shown(\s|$)/g              , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         )
}

function checkedIf(actor, value, event){
	var button, checkbox, radio

	if (value === null) { return }

	button         = { 'tagName'      : 'BUTTON'     }
	checkbox       = { 'role'         : 'checkbox'   }
	radio          = { 'role'         : 'radio'      }

	is(button) && is(checkbox) && !value ? actor.setAttribute('aria-pressed', 'false') :
	is(button) && is(checkbox) &&  value ? actor.setAttribute('aria-pressed', 'true' ) :
	is(button) && is(radio)    && !value ? actor.setAttribute('aria-checked', 'false') :
	is(button) && is(radio)    &&  value ? actor.setAttribute('aria-checked', 'true' ) :
	                                       void Function

	function is(attributes){
		return has(actor, attributes)
	}
}

function concealedIf(actor, value, event){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?concealed(?:\s|$))/g    , 'concealed '    )
	                                         .replace(/(^|\s)not-concealed(\s|$)/g          , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-concealed(?:\s|$))/g, 'not-concealed ')
	                                         .replace(/(^|\s)concealed(\s|$)/g              , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             )
}

function disabledIf(actor, value, event){
	var isDisabled

	isDisabled     = actor.hasAttribute('disabled')
	isAriaDisabled = actor.getAttribute('aria-disabled') === 'true'

	 value &&  isDisabled ? void Function                          :
	 value && !isDisabled ? actor.setAttribute('disabled', 'true') :
	!value &&  isDisabled ? actor.removeAttribute('disabled')      :
	!value && !isDisabled ? void Function                          :
	                        void Function

	 value &&  isAriaDisabled &&  isDisabled ? void Function                                :
	 value &&  isAriaDisabled && !isDisabled ? void Function                                :
	 value && !isAriaDisabled &&  isDisabled ? void Function                                :
	 value && !isAriaDisabled && !isDisabled ? actor.setAttribute('aria-disabled', 'true')  :
	!value &&  isAriaDisabled &&  isDisabled ? actor.setAttribute('aria-disabled', 'false') :
	!value &&  isAriaDisabled && !isDisabled ? actor.setAttribute('aria-disabled', 'false') :
	!value && !isAriaDisabled &&  isDisabled ? void Function                                :
	!value && !isAriaDisabled && !isDisabled ? void Function                                :
	                                           void Function

}

function controls(actor, value, event){
	var target, ancestor, controlledElement, button, checkbox, radio, ariaExpandedTrue, ariaExpandedFalse, radiogroup,
	    radiogroupWithPopup

	target              = {}
	target.element      = event && event.target || actor
	target.ancestor     = target
	controlledElement   = document.getElementById(target.element.getAttribute('data-controls'))
	button              = { 'tagName'      : 'BUTTON'     }
	checkbox            = { 'role'         : 'checkbox'   }
	radio               = { 'role'         : 'radio'      }
	ariaExpandable      = { 'aria-expanded': null         }
	ariaExpandedTrue    = { 'aria-expanded': 'true'       }
	ariaExpandedFalse   = { 'aria-expanded': 'false'      }
	radiogroup          = { 'role'         : 'radiogroup' }
	radiogroupWithPopupExpanded  = { 'role'         : 'radiogroup',
	                                 'aria-haspopup': 'true'      ,
	                                 'aria-expanded': 'true'        }
	radiogroupWithPopupCollapsed = { 'role'         : 'radiogroup',
	                                 'aria-haspopup': 'true'      ,
	                                 'aria-expanded': 'false'       }

	equals(actor) && is(button) && is(checkbox)                                                     ? toggleCheck(controlledElement) :
	equals(actor) && is(button) && is(radio)    && bornOf(radiogroup) && !controlledElement.checked ? toggleCheck(controlledElement) :
	                                                                                                  void Function

	equals(actor) && is(button) && is(radio) && is(ariaExpandedFalse) && bornOf(radiogroupWithPopupCollapsed) ? ( removeAriaExpanded(target.element)       , setAriaExpanded(target.ancestor, 'true' ) , enableRadiosInRadiogroup(target.ancestor)                       ) :
	equals(actor) && is(button) && is(radio) && !w(ariaExpandable)    && bornOf(radiogroupWithPopupCollapsed) ? (                                            setAriaExpanded(target.ancestor, 'true' ) , enableRadiosInRadiogroup(target.ancestor)                       ) :
	equals(actor) && is(button) && is(radio) &&                          bornOf(radiogroupWithPopupExpanded)  ? ( setAriaExpanded(target.element, 'false') , setAriaExpanded(target.ancestor, 'false') , disableOtherRadiosInRadiogroup(target.ancestor, target.element) ) :
		                                                                                                        ( void Function                                                                                                                                          )

	function w(attributes){
		var match, value

		match = true
		for (attribute in attributes){
			value = target.element.hasAttribute(attribute)
			match = match && value
		}
		
		return match
	}
	function equals(element){
		var equalsElement
		equalsElement = element === target.element

		return equalsElement
	}

	function is(attributes){
		var match

		match = true

		if (!target.element.getAttribute){ return false }
		match = has(target.element, attributes)

		return match
	}

	function bornOf(attributes){
		var ancestor, match

		ancestor = target.element
		match    = false

		for (ancestor = target.element; ancestor.getAttribute !== undefined; ancestor = ancestor.parentNode){
			has(ancestor, attributes) ? ( match = true , target.ancestor = ancestor ) :
			                            ( void Function                             )
		}

		return match
	}
}

function toggleCheck(element){ element.checked = !element.checked }

function has(element, attributes){
	var match, value

	match = true
	for (attribute in attributes){
		value = element.getAttribute(attribute) || element[attribute]
		match = match && value === attributes[attribute]
	}
	
	return match
}

function removeAriaExpanded(element){ element.removeAttribute('aria-expanded') }

function setAriaExpanded(element, value){ element.setAttribute('aria-expanded', value) }

function disableOtherRadiosInRadiogroup(radiogroup, radio){
	var radios, i

	radios = radiogroup.getElementsByTagName('button')

	for (i = 0; i < radios.length; i++){
		if (radios[i] === radio) { continue }
		radios[i].setAttribute('disabled', '')
	}
}

function enableRadiosInRadiogroup(radiogroup){
	var radios, i

	radios = radiogroup.getElementsByTagName('button')

	for (i = 0; i < radios.length; i++){
		radios[i].removeAttribute('disabled')
	}
}

function getIndexInArray(array, member){
	var i

	for (i = 0; i < array.length; i++){
		if (array[i] === member) { break }
	}

	return i
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
