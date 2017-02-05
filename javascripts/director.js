//void function(){
var actors, actions, acts

actors  = []
state   = { 'controls':    controls }
actions = {  'checked':   checked,
               'shown':     shown,
           'concealed': concealed,
            'disabled':  disabled
          }

document.onreadystatechange = applyAddressBarParametersToView
document.onclick            = applyInterfaceToView

void disableForms()
void conveyStageDirections()

function applyAddressBarParametersToView(){
	applyAddressBarParametersToState()
	applyStateToView()
}

function applyInterfaceToView(event){
	applyInterfaceToState(event)
	applyStateToView(event)
}

function applyAddressBarParametersToState(){
	var textParameters, parameters, i, element 

	if (document.readyState === 'interactive' || document.readyState === 'complete'){
		textParameters = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
		parameters     = textParameters.split(',')

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
	var i, actor, k, action, result

	for (i = 0; i < actors.length; i++){
		actor = actors[i]
		for (k = 0; k < actor.actions.length; k++){
			action = actor.actions[k]
			result = verifyCues(action, actor)
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
			actors[i] !== undefined && actors[i].element === actor ? actors[i].actions.push(                   { verb: actions[action], cues: getCues(action, actor) }     ) :
			actors[i] !== undefined && actors[i].element !== actor ? actors.push( { element: actor, actions: [ { verb: actions[action], cues: getCues(action, actor) } ] } ) :
			                                                         void Function
		}
	}
}

function getCues(action, actor){
	var attibute, textCues, cues

	attribute = 'data-' + action
	textCues  = actor.getAttribute(attribute)
	cues      = parseTextIntoCues(textCues)

	return cues
}

function parseTextIntoCues(string){
	var cuesWithReferences, cues

	cuesWithReferences  = getCuesWithReferences(string)
	cues                = getDerefencedCues(cuesWithReferences)

	return cues
}

function getCuesWithReferences(string){
	var cues, textCuesSplitOnOR, i, cue, textCuesSplitOnORthenAND, k, textCueAtomWithFlag, negated,
	    textCueAtom, cueIsNameValuePair, reference, cueIsReferenceToData, cueIsReferenceToInput, cueAtom

	cues = []
	textCuesSplitOnOR = string.split(/\|\|/g)

	for (i = 0; i < textCuesSplitOnOR.length; i++){
		cues[i] = []
		cue = cues[i]
		textCuesSplitOnORthenAND = textCuesSplitOnAND(textCuesSplitOnOR[i])
		for (k = 0; k < textCuesSplitOnORthenAND.length; k++){
			textCueAtomWithFlag = textCuesSplitOnORthenAND[k]
			negated             = textCueAtomWithFlag.charAt(0) === "!"
			textCueAtom         = negated ? textCueAtomWithFlag.substring(1) :
			                                textCueAtomWithFlag
			cueIsNameValuePair    = !!textCueAtom.match(/.+=.+/g)
			reference             = !cueIsNameValuePair && document.getElementById(textCueAtom)
			cueIsReferenceToData  = reference && reference.getAttribute('data-ref')
			cueIsReferenceToInput = reference && reference.tagName === 'INPUT'

			cueIsNameValuePair    ? cueAtom = cueAtomFromStatement(textCueAtom, negated) :
			cueIsReferenceToData  ? cueAtom = cueAtomFromDataRef(textCueAtom, negated)   :
			cueIsReferenceToInput ? cueAtom = cueAtomFromIdRef(textCueAtom, negated)     :
			                        void Function
			cue.push(cueAtom)
		}
	}
	return cues
}

function getDerefencedCues(cues){
	var i, cue, k, cueAtom, ref, cueAtomsInRef, m, cueAtomToAdd, n

	for (i = 0; i < cues.length; i++){
		cue = cues[i]
		for (k = 0; k < cue.length; k++){
			cueAtom = cue[k]
// ref1 & if1                                    ref1 / if1
// (if2 & if3) & if1 -> if2 & if3 & if1          (if2 & if3) / if1 -> if2 & if3 / if1
// (if2 / if3) & if1 -> if2 & if1 / if3 & if1    (if2 / if3) / if1 -> if2 / if3 / if1
			if (cueAtom.type === 'reference'){
				ref = cue.splice(k, 1)
				if (ref[0].cues.length === 1){
					cueAtomsInRef = ref[0].cues[0]
					for (m = 0; m < cueAtomsInRef.length; m++){
						cueAtomToAdd = cueAtomsInRef[m]
						cue.splice(k + m, 0, cueAtomToAdd)
					}
				}
				if (ref[0].cues.length > 1){
					for (m = 1; m < ref[0].cues.length; m++){
						cues.splice(i + m, 0, cue.slice())
					}
					for (m = 0; m < ref[0].cues.length; m++){
						cueAtomsInCueInRef = ref[0].cues[m]
						for (n = 0; n < cueAtomsInCueInRef.length; n++){
							cueAtomToAdd = cueAtomsInCueInRef[n]
							cues[i+m].splice(k+n, 0, cueAtomToAdd)
						}
					}
				}
			}
		}
	}

	return cues
}

function textCuesSplitOnAND(string){
 	var textCues, i

 	textCues = string.split(/[&\s]/g)

	for (i = 0; i < textCues.length; i++){
		textCues[i] === "" ? ( textCues.splice(i, 1), i = i - 1 ) :
		                     ( void Function                    )
	}

	return textCues
}

function mergeImportedCuesWithCurrentCues(importedCues, cues){
	var i

	for (i = 0; i < importedCues.cues.length; i++){
		cues.push(importedCues.cues[i])
	}
}

function cueAtomFromStatement(string, negated){
	var parts, name, value, element, cueAtom

	parts   = string.split(/=/g)
	name    = parts[0]
	value   = parts[1]
	element = elementWithNameValue(name, value)

	cueAtom = { type   : 'name=value',
	            negated: negated,
	            text   : string,
	            element: element
	          }

	return cueAtom
}

function elementWithNameValue(name, value){
	var elementsWithName, i, element 

	elementsWithName = document.getElementsByName(name)
	for (i = 0; i < elementsWithName.length; i++){
		elementsWithName[i].value === value ? element = elementsWithName[i] :
		                                      void Function
	}
	return element
}

function cueAtomFromDataRef(string, negated){
	var textCue, cues, cueAtom

	textCue = document.getElementById(string).getAttribute('data-ref')
	cues    = parseTextIntoCues(textCue)
	cueAtom = { type   : 'reference',
	            negated: negated,
	            text   : string,
	            cues   : cues
	          }

	return cueAtom
}

function cueAtomFromIdRef(string, negated){
	var element, cueAtom

	element = document.getElementById(string)
	cueAtom = { type   : 'id',
	            negated: negated,
	            text   : string,
	            element: element
	          }

	return cueAtom
}

function verifyCues(action, actor){
	var result, i, cue, cueTruth

	result = false

	for (i = 0; i < action.cues.length; i++){
		cue      = action.cues[i]
		cueTruth = verifyCue(cue, action, actor)
		result   = result || cueTruth
	}

	return result
}

function verifyCue(cue, action, actor){
	var result, i, cueAtom

	result = true

	for (i = 0; i < cue.length; i++){
		cueAtom = cue[i]
		result  = result && verifyCueAtom(cueAtom, cue, action, actor)
	}

	return result
}

function verifyCueAtom(cueAtom, cue, action, actor){
	var textCueAtom, validString, element, validElement, truth

	textCueAtom  = cueAtom.text
	validString  = textCueAtom !== null && textCueAtom !== undefined
	element      = cueAtom.element
	validElement = element !== null

	if (!validString ){ return (logTextCueError(cueAtom, cue, action, actor), false) }
	if (!validElement){ return (logElementError(cueAtom, cue, action, actor), false) }

	truth =  cueAtom.negated ? !element.checked :
	        !cueAtom.negated ?  element.checked :
	                            false

	return truth
}

function logTextCueError(cueAtom, cue, action, actor){
	var actorIndex, actionIndex, cueIndex

	actorIndex  = getIndexInArray(actors, actor)
	actionIndex = getIndexInArray(actor.actions, action)
	cueIndex    = getIndexInArray(action.cues, cue)

	console &&
	console.log.apply(null,
		              ['An actor\'s cue \'s could not be understood', '\n',
	                   'actor: ', actors[actorIndex].element,
	                   ', action: ', actors[actorIndex].actions[actionIndex].verb.name,
	                   ', cue: ', actors[actorIndex].actions[actionIndex].cues[cueIndex], '\n'
	                  ])
}

function logElementError(cueAtom, cue, action, actor){
	var actorIndex, actionIndex, cueIndex

	actorIndex  = getIndexInArray(actors, actor)
	actionIndex = getIndexInArray(actor.actions, action)
	cueIndex    = getIndexInArray(action.cues, cue)

	console &&
	console.log.apply(null,
		                    ['Can not locate actor with id ', cueAtom.text, '\n',
	                         'requesting actor: ', actors[actorIndex].element,
	                         ', action: ', actors[actorIndex].actions[actionIndex].verb.name,
	                         ', cue: ', actors[actorIndex].actions[actionIndex].cues[cueIndex], '\n'
	                        ])
}

function callSheet(actor){
	var i

	for (i = 0; i < actors.length; i++){
		if (actors[i].element === actor){
			break
		}
	}

	return actors[i]
}

function explain(actor){
	var i, action, k, cue, cueInfo, m, cueAtom, conjunction, negated, name, value

	if (actor === undefined){
		console && console.log('The element isn\'t an an actor')
		return
    }
	if (actor.actions.length === 0){
		console && console.log('The actor has no actions')
		return
	}

	for (i = 0; i < actor.actions.length; i++){
		action = actor.actions[i]
		console.log(action.verb.name, verifyCues(action, actor))
		for (k = 0; k < action.cues.length; k++){
			cue = action.cues[k]
			cueInfo = []
			for (m = 0; m < cue.length; m++){
				cueAtom = cue[m]
				conjunction = cue.length === 1     ? ''  : 
				              m === cue.length - 1 ? ''  :
				                                     '&'
				negated = cueAtom.negated ? '!' :
				                            ''
				name = cueAtom.element.name
				value = cueAtom.element.value
				cueInfo.push(negated, name, value, verifyCueAtom(cueAtom, cue, action, actor), conjunction)
			}
			console.log.apply(null, cueInfo)
		}
	}
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
	var button, checkbox, radio

	if (value === null) { return }

	button         = { 'tagName' : 'BUTTON'   }
	checkbox       = { 'role'    : 'checkbox' }
	radio          = { 'role'    : 'radio'    }

	is(button) && is(checkbox) && !value ? actor.setAttribute('aria-pressed', 'false') :
	is(button) && is(checkbox) &&  value ? actor.setAttribute('aria-pressed', 'true' ) :
	is(button) && is(radio)    && !value ? actor.setAttribute('aria-checked', 'false') :
	is(button) && is(radio)    &&  value ? actor.setAttribute('aria-checked', 'true' ) :
	                                       void Function

	function is(attributes){
		return has(actor, attributes)
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
	var isDisabled, isAriaDisabled

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
	var target, ancestor, controlledElement, button, checkbox, radio, ariaExpandable, ariaExpandedTrue,
	    ariaExpandedFalse, radiogroup, radiogroupWithPopupExpanded, radiogroupWithPopupCollapsed

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
		var match, attribute, value

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
	var match, attribute, value

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
