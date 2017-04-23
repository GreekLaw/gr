//void function(){
var actors, actions, acts

actors  = []
state   = {  'controls':  controls,
	       'controlled': controlled
	      }
actions = {   'checked':   checked,
	            'shown':     shown,
	        'concealed': concealed,
	         'disabled':  disabled
	      }
a = {	                        input: {       'tagName': 'INPUT'      },
	                      dataRef: {      'data-ref': undefined    },
	                     disabled: {      'disabled': ''           },
	                 ariaDisabled: { 'aria-disabled': 'true'       },
	              ariaNotDisabled: { 'aria-disabled': 'false'      },
	                  ariaPressed: {  'aria-pressed': 'true'       },
	               ariaNotPressed: {  'aria-pressed': 'false'      },
	                  ariaChecked: {  'aria-checked': 'true'       },
	               ariaNotChecked: {  'aria-checked': 'false'      },
	                 ariaExpanded: { 'aria-expanded': 'true'       },
	              ariaNotExpanded: { 'aria-expanded': 'false'      },
	                   radiogroup: {          'role': 'radiogroup' },
	               checkboxButton: {       'tagName': 'BUTTON'    ,
	                                          'role': 'checkbox'   },
	                  radioButton: {       'tagName': 'BUTTON'    ,
	                                          'role': 'radio'      },
	  radiogroupWithExpandedPopup: {          'role': 'radiogroup',
	                                 'aria-haspopup': 'true'      ,
	                                 'aria-expanded': 'true'       },
	 radiogroupWithCollapsedPopup: {          'role': 'radiogroup',
	                                 'aria-haspopup': 'true'      ,
	                                 'aria-expanded': 'false'      }
    }
an = a
ancestor = { self: document, seed: seed, is: setAttrOnAnc, isnt: removeAttrOnAnc,
	         enableAllRadios: enableAllRadiosOnAnc, disableRadiosExcept: disableRadiosExceptOnAnc
	       }

function seed(element){ this.self = element }
function setAttrOnAnc(){return setAttr.apply(ancestor.self, arguments) }
function removeAttrOnAnc(){return removeAttr.apply(ancestor.self, arguments) }
function enableAllRadiosOnAnc(){return enableAllRadios.apply(ancestor.self, arguments) }
function disableRadiosExceptOnAnc(){return disableRadiosExcept.apply(ancestor.self, arguments) }

function setAttr(object){
	var attribute

	for (attribute in object){
		this.setAttribute(attribute, object[attribute])
	}
}

function removeAttr(object){
	var attribute

	for (attribute in object){
		this.removeAttribute(attribute)
	}
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
	var textParameters, parameters, i, parameterIsNameValuePair, nameValue, name, value, element 

	if (document.readyState === 'interactive' || document.readyState === 'complete'){
		textParameters = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
		parameters     = textParameters.split('&')

		if (parameters.length === 1 && parameters[0] === '') { return }

		for (i = 0; i < parameters.length; i++){
			parameterIsNameValuePair = !!parameters[i].match(/(.+)=(.+)/g)
			parameterIsNameValuePair ? (nameValue = parameters[i].split(/=/g), name = nameValue[0], value = nameValue[1]) :
			                           void Function
			element =  parameterIsNameValuePair && name !== '' && value !== '' ? elementWithNameValue(name, value)   :
			           parameterIsNameValuePair && name !== '' && value === '' ? document.getElementsByName(name)[0] :
			           parameterIsNameValuePair && name === ''                 ? elementWithValue(value)             :
				  !parameterIsNameValuePair                                ? elementWithValue(value)             :
			                                                                     void Function
			element && !element.checked ? element.checked = true : 
			                              void Function
		}
	}
}

function applyInterfaceToState(event){
	var stateControls, i, actor, result, stateControlled

	stateControls = document.querySelectorAll('[data-controls]')
	for (i = 0; i < stateControls.length; i++){
		actor  = stateControls[i]
		result = true
		controls(actor, result, event)
	}
	stateControlled = document.querySelectorAll('[data-controlled]')
	for (i = 0; i < stateControlled.length; i++){
		actor  = stateControlled[i]
		result = true
		controlled(actor, result, event)
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
	var action, actionables, actorsWithAction, i, actor, callSheetI, isActorInCallSheet

	for (action in actions){
		actionables      = document.querySelectorAll('[data-' + action + ']')
		actorsWithAction = Array.prototype.slice.call(actionables)
		for (i = 0; i < actorsWithAction.length; i++){
			actor              = actorsWithAction[i]
			callSheetI         = getIndexInArray(actors, actor)
			isActorInCallSheet = callSheetI !== null ? callSheetI :
			                                           false
			!isActorInCallSheet ? actors.push(                     { element: actor, actions: [ { verb: actions[action], cues: getCues(action, actor) } ] } ) :
			 isActorInCallSheet ? actors[callSheetI].actions.push(                              { verb: actions[action], cues: getCues(action, actor) }     ) :
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

	cuesWithReferences = getCuesWithReferences(string)
	cues               = getDerefencedCues(cuesWithReferences)

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
			textCueAtomWithFlag   = textCuesSplitOnORthenAND[k]
			negated               = textCueAtomWithFlag.charAt(0) === "!"
			textCueAtom           = negated ? textCueAtomWithFlag.substring(1) :
			                                  textCueAtomWithFlag
			cueIsNameValuePair    = !!textCueAtom.match(/.+=.+/g)
			reference             = !cueIsNameValuePair && document.getElementById(textCueAtom)
			cueIsReferenceToData  = reference && reference.getAttribute('data-ref')
			cueIsReferenceToInput = reference && is(reference, a.input)

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
	var cuesI, cue, cueI, cueAtom, ref, cueAtomsInRef, cueAtomsInRefI, cueAtomToAdd, cueAtomsInCueInRef, 
	cueAtomsInCueInRefI, cuesInRef, cuesInRefI, cueToAdd

	for (cuesI = 0; cuesI < cues.length; cuesI++){
		cue = cues[cuesI]
		for (cueI = 0; cueI < cue.length; cueI++){
			cueAtom = cue[cueI]
// FIXME: handle exception when a data-shown is pointing to a non-existing ref
//     ref1     & if1                                  ref1     || if1
// (if2 &  if3) & if1 -> if2 & if3 &  if1          (if2 &  if3) || if1  ->  if2 &  if3 || if1
// (if2 || if3) & if1 -> if2 & if1 || if3 & if1    (if2 || if3) || if1  ->  if2        || if3 || if1
			if (cueAtom.type === 'reference' && cue.length > 1){
				ref = cue.splice(cueI, 1)
				if (ref[0].cues.length === 1){
					cueAtomsInRef = ref[0].cues[0]
					for (cueAtomsInRefI = 0; cueAtomsInRefI < cueAtomsInRef.length; cueAtomsInRefI++){
						cueAtomToAdd = cueAtomsInRef[cueAtomsInRefI]
						cue.splice(cueI + cueAtomsInRefI, 0, cueAtomToAdd)
					}
				}
		else	if (ref[0].cues.length > 1){
					for (cuesInRefI = 1; cuesInRefI < ref[0].cues.length; cuesInRefI++){
						cues.splice(cuesI + cuesInRefI, 0, cue.slice())
					}
					for (cuesInRefI = 0; cuesInRefI < ref[0].cues.length; cuesInRefI++){
						cueAtomsInCueInRef = ref[0].cues[cuesInRefI]
						for (cueAtomsInCueInRefI = 0; cueAtomsInCueInRefI < cueAtomsInCueInRef.length; cueAtomsInCueInRefI++){
							cueAtomToAdd = cueAtomsInCueInRef[cueAtomsInCueInRefI]
							cues[cuesI + cuesInRefI].splice(cueI + cueAtomsInCueInRefI, 0, cueAtomToAdd)
						}
					}
				}
			}
			if (cueAtom.type === 'reference' && cue.length === 1){
				ref = cue.splice(cueI, 1)
				if (ref[0].cues.length === 1){
					cues.splice(cuesI, 1, ref[0].cues[0].slice())
				}
		else	if (ref[0].cues.length > 1){
					for (cuesInRefI = 1; cuesInRefI < ref[0].cues.length; cuesInRefI++){
						cues.splice(cuesI + cuesInRefI, 0, cue.slice())
					}
					for (cuesInRefI = 0; cuesInRefI < ref[0].cues.length; cuesInRefI++){
						cueToAdd = ref[0].cues[cuesInRefI]
						cues[cuesI + cuesInRefI] = cueToAdd
					}
					cuesI = cuesI + cuesInRefI - 1
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

function elementWithValue(value){
	var inputs, i, element
	
	inputs = document.getElementsByTagName('input')
	for (i = 0; i < inputs.length; i++){
		inputs.value === value ? element = inputs[i] :
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
	                  ['An actor\'s cue was null or undefined', '\n',
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
				cueAtom     = cue[m]
				conjunction = cue.length === 1     ? ''  : 
				              m === cue.length - 1 ? ''  :
				                                     '&'
				negated     = cueAtom.negated ? '!' :
				                                ''
				name        = cueAtom.element.name
				value       = cueAtom.element.value
				cueInfo.push(negated, name, value, verifyCueAtom(cueAtom, cue, action, actor), conjunction)
			}
			console.log.apply(null, cueInfo)
		}
	}
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

function shown(actor, cued, event){
	if (cued === null) { return }
	cued ? actor.className = actor.className.replace(/^(?!(?:.*\s)?shown(?:\s|$))/g    , 'shown '    )
	                                        .replace(/(^|\s)not-shown(\s|$)/g          , '$1$2'      )
	                                        .replace(/\s+/g                            , ' '         ) :
	       actor.className = actor.className.replace(/^(?!(?:.*\s)?not-shown(?:\s|$))/g, 'not-shown ')
	                                        .replace(/(^|\s)shown(\s|$)/g              , '$1$2'      )
	                                        .replace(/\s+/g                            , ' '         )
}

function concealed(actor, cued, event){
	if (cued === null) { return }
	cued ? actor.className = actor.className.replace(/^(?!(?:.*\s)?concealed(?:\s|$))/g    , 'concealed '    )
	                                        .replace(/(^|\s)not-concealed(\s|$)/g          , '$1$2'          )
	                                        .replace(/\s+/g                                , ' '             ) :
	       actor.className = actor.className.replace(/^(?!(?:.*\s)?not-concealed(?:\s|$))/g, 'not-concealed ')
	                                        .replace(/(^|\s)concealed(\s|$)/g              , '$1$2'          )
	                                        .replace(/\s+/g                                , ' '             )
}

function checked(actor, cued, event){
	var aCheckboxButton, aRadioButton, it

	if (cued === null) { return }

	aCheckboxButton = is(actor, a.checkboxButton)
	aRadioButton    = is(actor, a.radioButton)
	it              = contextual(actor)

	aCheckboxButton && !cued ? it.is(a.ariaNotPressed) :
	aCheckboxButton &&  cued ? it.is(a.ariaPressed   ) :
	aRadioButton    && !cued ? it.is(a.ariaNotChecked) :
	aRadioButton    &&  cued ? it.is(a.ariaChecked   ) :
	                           void Function

}

function disabled(actor, cued, event){
	var isDisabled, isAriaDisabled, it

	isDisabled     = is(actor, a.disabled)
	isAriaDisabled = is(actor, a.ariaDisabled)
	it             = contextual(actor)

	 cued &&  isAriaDisabled &&  isDisabled ? ( void Function                                  ) :
	 cued &&  isAriaDisabled && !isDisabled ? (                            it.is(a.disabled)   ) :
	 cued && !isAriaDisabled &&  isDisabled ? ( it.is(a.ariaDisabled)                          ) :
	 cued && !isAriaDisabled && !isDisabled ? ( it.is(a.ariaDisabled)    , it.is(a.disabled)   ) :
	!cued &&  isAriaDisabled &&  isDisabled ? ( it.is(a.ariaNotDisabled) , it.isnt(a.disabled) ) :
	!cued &&  isAriaDisabled && !isDisabled ? ( it.is(a.ariaNotDisabled)                       ) :
	!cued && !isAriaDisabled &&  isDisabled ? (                            it.isnt(a.disabled) ) :
	!cued && !isAriaDisabled && !isDisabled ? ( void Function                                  ) :
	                                            void Function

}

function controlled(actor, cued, event){
	var actorI, actorO, actionI, action, cues, result

	//actorI  = getIndexInArray(actors, actor)
	//actorO  = actors[actorI]
	//actionI = getIndexOfActionVerbInActorInCallSheet(controlled, actorO)
	//action  = actorO.actions[actionI]
	cues    = getCues('controlled', actor)
	action  = {cues: cues, verb: controlled}
	actorON = {actions:[action], element: actor}
	result  = verifyCues(action, actorON)

	 result ? actor.checked = true :
	!result ? void Function        :
	          void Function
}

function controls(actor, cued, event){
	var target, controlledElement, it, anActor, aCheckboxButton, aRadioButton,
	    isAriaExpandable, isAriaExpanded, isAriaNotExpanded

	target            = event && event.target || actor
	controlledElement = document.getElementById(target.getAttribute('data-controls'))
	it                = contextual(target)
	anActor           = equals(target, actor)
	aCheckboxButton   = is(target, a.checkboxButton)
	aRadioButton      = is(target, a.radioButton)
	isAriaExpandable  = has(target, a.ariaExpanded)
	isAriaExpanded    = is(target, a.ariaExpanded)
	isAriaNotExpanded = is(target, a.ariaNotExpanded)

	anActor && aCheckboxButton                                                                        ? toggleCheck(controlledElement) :
	anActor && aRadioButton    && isAn(ancestor, a.radiogroup, it.self) && !controlledElement.checked ? toggleCheck(controlledElement) :
	                                                                                                    void Function

	anActor && aRadioButton &&  isAriaNotExpanded && isAn(ancestor, a.radiogroupWithCollapsedPopup, it.self) ? ( it.isnt(a.ariaExpanded)  , ancestor.is(a.ariaExpanded   ) , ancestor.enableAllRadios()            ) :
	anActor && aRadioButton && !isAriaExpandable  && isAn(ancestor, a.radiogroupWithCollapsedPopup, it.self) ? (                            ancestor.is(a.ariaExpanded   ) , ancestor.enableAllRadios()            ) :
	anActor && aRadioButton &&                       isAn(ancestor, a.radiogroupWithExpandedPopup , it.self) ? ( it.is(a.ariaNotExpanded) , ancestor.is(a.ariaNotExpanded) , ancestor.disableRadiosExcept(it.self) ) :
	                                                                                                           ( void Function                                                                                       )
}

function contextual(element){
	function setAttrOnIt(){ return setAttr.apply(element, arguments) }
	function removeAttrOnIt(){ return removeAttr.apply(element, arguments)}

	return { is: setAttrOnIt, isnt: removeAttrOnIt, self: element }
}

function equals(source, target){
	var equalsElement

	equalsElement = source === target

	return equalsElement
}

function is(element, attributes){
	var match, attribute, value

	match = true

	for (attribute in attributes){
		value = element.hasAttribute(attribute) ? element.getAttribute(attribute) :
			                                  element[attribute]
		match = match && value === attributes[attribute]
	}
	
	return match
}

function has(element, attributes){
	var match, attribute, value

	match = true

	for (attribute in attributes){
		value = element.hasAttribute(attribute)
		match = match && value
	}

	return match
}

function isAn(ancestor, attributes, element){
	var match, parent

	match = false

	for (parent = element; parent.getAttribute !== undefined; parent = parent.parentNode){
		is(parent, attributes) ? ( match = true , ancestor.seed(parent) ) :
		                         ( void Function                        )
	}

	return match
}

function toggleCheck(element){ element.checked = !element.checked }

function enableAllRadios(){
	var radios, i

	radios = this.getElementsByTagName('button')

	for (i = 0; i < radios.length; i++){
		removeAttr.call(radios[i], a.disabled)
	}
}

function disableRadiosExcept(radio){
	var radios, i

	radios = this.getElementsByTagName('button')

	for (i = 0; i < radios.length; i++){
		if (radios[i] === radio) { continue }
		setAttr.call(radios[i], a.disabled)
	}
}

function getIndexInArray(array, member){
	var i, index

	for (i = 0; i < array.length; i++){
		if (array[i] === member) { break }
	}

	index = i < actors.length ? i    :
	                            null
	return index
}

function getIndexOfActionVerbInActorInCallSheet(verb, actor){
	var i, index

	for (i = 0; i < actor.actions.length; i++){
		if (actor.actions[i].verb === verb){
			break
		}
	}
	index = i < actor.actions.length ? i     :
	                                   false
	return index
}

function preventEvent(event){
	event.preventDefault()
	return false
}
//}
