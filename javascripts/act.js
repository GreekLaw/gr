 //void function(){
actions = { show:    show   ,
            select:  select ,
            conceal: conceal
          }

var actions, action, actors, actor, triggersString, triggerStrings, triggers, trigger, conditions, condition, i, k, m

for (action in actions){
	actions[action].actors = getArrayFromNodeList(document.querySelectorAll('[data-' + action + ']'))
	actors = actions[action].actors
	for (i = 0; i < actors.length; i++){
		actor = actors[i]
		triggersString = actor.getAttribute('data-' + action)
		triggerStrings = triggersString.split(/\s/g)
		actor.triggers = []
		for (k = 0; k < triggerStrings.length; k++){
			actor.triggers[k] = []
			conditions = triggerStrings[k].split(/(?=[+-])/g)
			for (m = 0; m < conditions.length; m++){
				conditionParts = conditions[m].split(/(?=[+-])|(?=if\d+)/g)
				conditionFlag  = conditionParts[0] === '+' ? true  :
				                 conditionParts[0] === '-' ? false :
				                                             true

				conditionTerm = /if\d+/.test(conditionParts[0]) ? conditionParts[0] :
				                /if\d+/.test(conditionParts[1]) ? conditionParts[1] :
				                                                  null
				condition = { flag: conditionFlag,
				              term:   conditionTerm
				            }
				actor.triggers[k].push(condition)
			}
		}
	}
}
// actor -> actions -> triggers -> conditions
document.addEventListener   ? document.addEventListener('DOMContentLoaded', applyAddressBarParameters) :
document.onreadystatechange ? document.onreadystatechange = applyAddressBarParameters                  :
                              void(null)

document.onclick = refreshState
refreshState()

function applyAddressBarParameters(){
	var parametersString, parameters, element, i

	parametersString = decodeURI ? decodeURI(document.location.search.substring(1)) : ''
	parameters       = parametersString.split(',')

	if (parameters.length === 1 && parameters[0] === '') { return }
	for (i = 0; i < parameters.length; i++){
		element = document.querySelector('.' + parameters[i])
		element && !element.checked ? element.click() : void(null)
	}
}

function refreshState(){
	var action, actors, actor, triggerValidity, i, k, result


	for (action in actions){
		actors = actions[action].actors
		for (i = 0; i < actors.length; i++){
			actor = actors[i]
			result = false
			for (k = 0; k < actor.triggers.length; k++){
				triggerValidity = verifyTrigger(actor.triggers[k])
				result = result || triggerValidity
			}
			actions[action](actor, result)
		}
	}
}

function verifyTrigger(trigger){
	var condition, result

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

function show(actor, value){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?shown(?:\s|$))/g    , 'shown '    )
	                                         .replace(/(^|\s)not-shown(\s|$)/g          , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-shown(?:\s|$))/g, 'not-shown ')
	                                         .replace(/(^|\s)shown(\s|$)/g              , '$1$2'      )
	                                         .replace(/\s+/g                            , ' '         )
}

function select(actor, value){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?selected(?:\s|$))/g    , 'selected '    )
	                                         .replace(/(^|\s)not-selected(\s|$)/g          , '$1$2'         )
	                                         .replace(/\s+/g                               , ' '            ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-selected(?:\s|$))/g, 'not-selected ')
	                                         .replace(/(^|\s)selected(\s|$)/g              , '$1$2'         )
	                                         .replace(/\s+/g                               , ' '            )
}
function conceal(actor, value){
	if (value === null) { return }
	value ? actor.className = actor.className.replace(/^(?!(?:.*\s)?concealed(?:\s|$))/g    , 'concealed '    )
	                                         .replace(/(^|\s)not-concealed(\s|$)/g          , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             ) :
	        actor.className = actor.className.replace(/^(?!(?:.*\s)?not-concealed(?:\s|$))/g, 'not-concealed ')
	                                         .replace(/(^|\s)concealed(\s|$)/g              , '$1$2'          )
	                                         .replace(/\s+/g                                , ' '             )
}
/*
	for action in actions {
		action.actors = document.querySelectorAll('do' + action.key)
		for actor in action.actors {
			actor.triggers = actor.getAttribute('do-' + action.key).split(/\s/g)
			for trigger in actor.triggers {
				conditions = trigger.split(/(!)?\d{1,3}/g)
				for condition in conditions {
					trigger.condition = {flag: '', term: ''}
				}
			}
		}
	}
*/
function getArrayFromNodeList(nodeList){
	var i, result

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
