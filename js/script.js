//"Basic Info" section variables
const $otherField = $('#other-title');

//"T-shirt Info" section variables
const $colorMenuPlaceholder = $('<option value="placeholder">Please select a T-shirt theme</option>');
const $color = $('#colors-js-puns');
const $colorMenu = $('#color');
const $designMenu = $('#design');
const $colorMenuOptions = $('#color option');

//"Register for Activities" section variables
const $activities = $('.activities');
let totalCost = 0;
const $checkboxes = $('.activities input');
const disabledMessage = ('<b>Overlapping time</b>');

//"Payment Info" section variables
const $paymentMenu = $('#payment option');
const $creditCardInfo = $('#credit-card');
const $payPalInfo = $('#paypal');
const $bitCoinInfo = $('#bitcoin');

//"Basic Info" Section

//Focus set to 'name' input field when page loads.
$('#name').focus();

//'Other' field is hidden until user selects 'other' in 'Job Role' field
//When 'other' is selected, a text input field is displayed.
//When another option is selected, the field's text is reset and the field is again hidden.
$($otherField).hide();
$('#title').change(function () {
    if ($(this).val() === 'other') {
        $($otherField).show();
    } else {
        $($otherField).val('').hide();        
    }    
});

//"T-Shirt Info" Section

//"Color" label and select menu remains hidden until a selection is made from "Design" menu.
$color.hide();

//No color options appear in 'color' drop down and the field until a T-shirt theme is selected.
$($colorMenuOptions).attr('hidden', true);
$($colorMenu).prepend($colorMenuPlaceholder)
$($colorMenuPlaceholder).attr('selected', true);

//Only options matching the theme selected via the 'design' menu will be displayed in the 'color' menu.
//Both menus are updated when a different theme is selected from the 'design' menu.
$($designMenu).change(function () {
    $($colorMenuPlaceholder).attr('hidden', true);
    if ($(this).val() === 'js puns') {
        $color.show();
        $($colorMenuOptions).each(function (i, element) {
            if (i <= 2) {
                $(element).removeAttr('hidden');
                $($colorMenuOptions).eq(3).attr('selected', false);
                $($colorMenuOptions).eq(0).attr('selected', true);
            } else {
                $(element).attr('hidden', true);
            }
        });
    } else if ($(this).val() === 'heart js') {
        $color.show();
        $($colorMenuOptions).each(function (i, element) {
            if (i >= 3) {
                $(element).removeAttr('hidden');
                $($colorMenuOptions).eq(0).attr('selected', false);
                $($colorMenuOptions).eq(3).attr('selected', true); 
            } else {
                $(element).attr('hidden', true);
            }
        });
    } else {
        $($colorMenuPlaceholder).attr('hidden', false);
        $($colorMenuOptions).each(function (i, element) {
            $(element).attr('hidden', true).attr('selected', false);         
        });
    }     
  
});

//"Register for Activities" Section

/*
Selection of two workshops of the same day and time cannot be selected.
If one is selected, another with an overlapping time is not selectable and the user is notified of its unavailability.
*/

//When activity is unchecked, any competing activities become available again.
$($activities).change(function (e) {
    const $checked = e.target;
    const $checkedTime = $($checked).attr('data-day-and-time');
    const $checkedCost = $($checked).attr('data-cost');
    console.log(parseInt($checkedCost.slice(1)));
    $checkboxes.each(function(i, element){
        const $checkboxTime = $(element).attr('data-day-and-time');
        if ($checkboxTime === $checkedTime && element !== $checked) {
            if ($($checked).prop('checked')) {
                $(element).prop('disabled', true);
                $(element).parent().append(disabledMessage);  
            } else {
                $(element).prop('disabled', false);
                $(element).next().remove();
            }  
        }
    });

/*
Below the checkboxes, the total cost of all selected activities is displayed when a checkbox is selected.
The total cost is updated each time a checkbox is selected or deselected.
*/
    if ($($checked).prop('checked')) {
        $('.activities p').remove();
        totalCost += parseInt($checkedCost.slice(1));
        const displayTotalCost = $(`<p><b>Total Cost: </b>$${totalCost}</p>`);
        $activities.append(displayTotalCost);
    } else {
        $('.activities p').remove();
        totalCost -= parseInt($checkedCost.slice(1));
        const displayTotalCost = $(`<p><b>Total Cost: </b>$${totalCost}</p>`);
        if (totalCost > 0) {     
            $activities.append(displayTotalCost);
        }  
    }
});

//"Payment Info" Section

//The payment option selected displays the corresponding payment section.

/* 
The "Credit Card" payment option is displayed by default. 
The "select method" option is disabled; user must select a payment option to submit the form.
Credit card section div is displayed.
"Paypal" and "Bitcoin" payment sections are hidden.
*/
$($paymentMenu).eq(1).attr('selected', true);
$($paymentMenu).eq(0).attr('disabled', true); 

$($payPalInfo).hide();
$($bitCoinInfo).hide();

//When "PayPal" payment option is selected, "PayPal" section is displayed, while "Credit Card" and "Bitcoin" sections are hidden.
$('#payment').change(function () {
    $($paymentMenu).eq(1).removeAttr('selected');
    if ($(this).val() === 'PayPal') {
        $($creditCardInfo).hide();
        $($bitCoinInfo).hide();
        $($payPalInfo).show();
    //When "Bitcoin" payment option is selected, "Bitcoin" section is displayed, while "Credit Card" and "PayPal" sections are hidden.
    } else if ($(this).val() === 'Bitcoin') {
        $($creditCardInfo).hide();
        $($payPalInfo).hide();
        $($bitCoinInfo).show();
    //When "Credit Card" payment option is selected, "Credit Card" section is displayed, while "PayPal" and "Bitcoin" sections are hidden.    
    } else {
        $($payPalInfo).hide();
        $($bitCoinInfo).hide();
        $($creditCardInfo).show();
    }
});

//Form Validation
    
//Name field must have text.
function nameTest (name) {
    return /\w/.test(name);
}
//Email field must have text in a valid email format.
function emailTest (email) {
    return /^[\w]+\@[\w]+\.[\w]+$/i.test(email);    
}
//In "Register for Activities", at least one checkbox must be selected.
function checkboxTest () {
    let result = false;
    $($checkboxes).each(function (i, element){
        if ($(element).prop('checked')) {
            result = true;
        }    
    });
    return result;
}

//In "Payment Info", if "Credit Card" is selected, a credit card number, zip code, and CVV must be supplied.
function creditCardTest () {
    let result = false;
    if ($($paymentMenu).eq(1).prop('selected')){
        //Credit card field must be between 13 and 16 characters, numbers only.
        const ccNumTest = /^\d{13,16}$/.test($('#cc-num').val());
        //Zip code field must be a 5-digit number.
        const ccZipTest = /^\d{5}$/.test($('#zip').val());
        //CVV must be a 3-digit number.
        const ccCvvTest = /^\d{3}$/.test($('#cvv').val());
        if (ccNumTest && ccZipTest && ccCvvTest) {
            result = true;
        } else {
        //If form submission is denied, a red text message indicative of the error appears next to the corresponding field(s):
            //Credit Card number 
                //If credit card number is blank, user is prompted to enter a number.
            if (!ccNumTest && $('#cc-num').val() === '') {
                const $errorMessage = $('<b>Please enter a credit card number</b>').css('color', 'red');
                $errorMessage.insertBefore('#cc-num');
                //If credit card number isn't empty but contains incorrect number of digits, user is prompted to enter between 13 and 16 digits
            } else {
                const $errorMessage = $('<b>Please enter a number that is between 13 and 16 digits long</b>').css('color', 'red');
                $errorMessage.insertBefore('#cc-num');
            }
            //Zip code
            if (!ccZipTest) {
                const $errorMessage = $('<b>Please enter zip code</b>').css('color', 'red');
                $errorMessage.insertBefore('#zip');
            }
            //CVV 
            if (!ccCvvTest) {
                const $errorMessage = $('<b>Please enter CVV code (found on back of credit card)</b>').css('color', 'red');
                $errorMessage.insertBefore('#cvv');
            }
        }
    } else {
        result = true;
    }
    return result;
}

// The following code checks for errors and prevents submision of the form.
$('form').submit(function(e) {
    $('b').remove();
    const nameResult = nameTest ($('#name').val());
    const emailResult = emailTest($('#mail').val());
    const checkboxResult = checkboxTest();
    const creditCardResult = creditCardTest();
    if (!nameResult || !emailResult || !checkboxResult || !creditCardResult) {
        e.preventDefault();
        //If form submission is denied, a red text message indicative of the error appears next to the corresponding field(s):
        //Name
        if (!nameResult) {
            const $errorMessage = $('<b>Input needed</b>').css('color', 'red');
            $errorMessage.insertBefore('#name');
        }
        
        //checkboxes (At least one activity must be selected)
        if(!checkboxResult){
            const $errorMessage =  $(`<b>Please select at least one activity<br>&nbsp</b>`).css('color', 'red');
            $errorMessage.insertAfter('.activities legend');
        } 
        //email
        if(!emailResult) {
            const $errorMessage =  $('<b>Email address incorrectly formatted</b>').css('color', 'red');
            $errorMessage.insertBefore('#mail');
        }
    } 
});

/*
User's entered email address is validated in real time, as it is typed.
An error message appears as the user types, and disappears once the email address is formatted correctly.
*/
$('#mail').on('input', function() {
    $('b:contains("Email")').remove();   
    const emailResult = emailTest($('#mail').val());
    if(!emailResult) {
        const $errorMessage =  $('<b>Email address incorrectly formatted</b>').css('color', 'red');
        $errorMessage.insertBefore('#mail');
    }
});