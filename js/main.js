"use strict";

// ===========================================================================
// INITIAL STUFFS / VALIDATION AND SEND EVENTS

const inputForm =  document.querySelector('form');
const formInputs = document.querySelectorAll('.tooltip input');
let invalids = [];

const helpMsgs = ['This field is required. ', 'Must be of the standard email format.', "'+358' + 9 numbers",
	'This field is optional.', 'Optional. If specified, must be exactly 5 characters.'];

document.getElementById("submitBtn").addEventListener("click", function(event) {

	if (!isValid(inputForm)) {

		event.preventDefault();
		invalids.forEach(reactToInvalid);
		invalids = [];
	}
	else {
		// submit the event somewhere
	}
});

formInputs.forEach( field => {
    field.addEventListener("mouseover", function(event) {
        onHover(event);
    });
});

formInputs.forEach( field => {
    field.addEventListener("mouseout", function(event) {
        onUnhover(event);
    });
});

// =====================================================================================================================
// CORE FUNCTION DEFINITIONS

function isValid(form) {

    const email = form.querySelector('#email');
    const phone = form.querySelector('#phoneNumber');
    const postal = form.querySelector('#postalCode');
    const inputs = form.querySelectorAll('input');

	let valid = true;

	// check for empty 'required' elements
	if (checkAllElemsWithAttr(isEmpty, inputs, 'required')) {

		valid = false;
	}

	// NOTE: I wasn't certain of the proper syntax to get checkAllElems... to work with this call:

	// checkAllElemsWithAttr(patternTest(<??? can i use parameters here?>), inputs, <'email="name"' ?? what do I put here?>);

	// ...so I just went with the 'naked' patternTest() function instead:

    // check for valid email pattern: 'letters + @ + letters + dot + three letters'
    if (!patternTest(email, /^\w+@\w+\.\w{3}$/)) {

        invalids.push(email);
        valid = false;
    }

	// check for valid (Finnish) phone number pattern: '+358 + 9 numbers'
	if(!isEmpty(phone)) {
		
		if (!patternTest(phone, /(^\+358)\d{9}$/)) {

			invalids.push(phone);
			valid = false;
		}
	}

	// check whether there's a postal code and if so, whether its length is appropriate
	if (!isEmpty(postal)) {

		if (postal.value.length !== 5) {

            invalids.push(postal);
			valid = false;
		}
	}

	return valid;
} // end isValid()

// ...What? It's named descriptively!
function checkAllElemsWithAttr(func, elements, attribute) {

    let returnValue = false; // in this case (validating a form), finalValue = 'false' means (eventually) a valid form (as regards this check)

    elements.forEach(function(element){

        if (element.hasAttribute(attribute)) {

			if (func(element)) {

                invalids.push(element); // unfortunately, this must be done here for the proper effect (affecting only a single element).
										// another option would be to put it in the empty-check, but that is even more awkward, as it's
                                        // also used in places where it doesn't invalidate anything
                if (!returnValue) {

                    returnValue = true; // no need for further checks once a single 'true' value has been caught
                }
			}
        }
    }); // end forEach()

    return returnValue;
} // end checkAllElemsWithAttr()

// checks an element's value for 'empty' ("") or any expanse of pure whitespace
function isEmpty(element) {

    let empty = false;

    if (element.value === "" || patternTest(element, /^\s+$/) ) { // what is the hex value of ""? this could be made simpler with that info

        empty = true;
    }

    return empty;
} // end isEmpty()

// checks whether a given element's text matches a given regular expression
function patternTest(element, expression) {

    let match = false;
    const pattern = new RegExp(expression);

    if (pattern.test(element.value)) {

        match = true;
    }

    return match;
}

// =====================================================================================================================
// UI HELPER FUNCTIONS (FOR TOOLTIPS ETC)

// upon submit attempt, the erroneous field's background will briefly change to a red color
function reactToInvalid(element) {

    element.style.backgroundColor = '#E86363';
    element.style.transition = 'background-color 0.5s linear';

    setTimeout(function(){
        element.style.backgroundColor = 'white';
    }, 500);
} // end reactToInvalid()

// called whenever the mouse pointer is brought over an input field
function onHover(event) {

	let tooltipText = "";
	let field = event.target;
	const span = field.parentElement.getElementsByTagName('span')[0];

	switch(field.name) {

		case 'firstname':

            tooltipText = helpMsgs[0];
            break;

        case 'lastname':

            tooltipText = helpMsgs[0];
            break;

        case 'email':

            tooltipText = helpMsgs[0] + helpMsgs[1];
            break;

        case 'phonenumber':

            tooltipText = helpMsgs[2];
            break;

        case 'address':

            tooltipText = helpMsgs[3];
            break;

        case 'postalcode':

            tooltipText = helpMsgs[4];
            break;

        case 'password':

            tooltipText = helpMsgs[0];
            break;
	} // end switch-statement

	span.innerText = tooltipText;
	span.style.visibility = 'visible';
	span.style.opacity = '1';
} // end onHover()

function onUnhover(event) {
	
	let field = event.target;
	const span = field.parentElement.getElementsByTagName('span')[0];
	span.style.visibility = 'hidden';
	span.style.opacity = '0';
}
