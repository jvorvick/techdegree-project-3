//variables
const $colorMenuPlaceholder = $('<option value="placeholder">Please select a T-shirt theme</option>');

const $colorMenu = $('#color');
const $designMenu = $('#design');
const $colorMenuOptions = $('#color option');
const $designMenuOptions = $('#design option');


//"T-Shirt Info"

//Focus set to 'name' input field when page loads
$('#name').focus();

//'Other' field is hidden until user selects 'other' in 'Job Role' field
$('#other-title').hide();

//No color options appear in 'color' drop down and the field until a T-shirt theme is selected.
$($colorMenuOptions).attr('hidden', true);
$($colorMenu).prepend($colorMenuPlaceholder)
$($colorMenuPlaceholder).attr('selected', true);

//Only options matching the theme selected via the 'design' menu will be displayed in the 'color' menu.
//Both menus are updated when a different theme is selected from the 'design' menu.
$($designMenu).change(function (event) {
   
    $($colorMenuPlaceholder).attr('hidden', true);
    
    if ($(this).val() === 'js puns') {
        
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

//"Register for Activities"

/*
Selection of two workshops of the same day and time cannot be selected.
If one is selected, another with an overlapping time is not selectable and the user is notified of its unavailability
*/

//When activity is unchecked, any competing activities become available again

const $activities = $('.activities');
let totalCost = 0;


const $checkboxes = $('.activities input');
const disabledMessage = ('<b>Overlapping time</b>');

$('.activities').change(function (e) {
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

//"Payment Info"

//The payment option selected displays the corresponding payment section.

/* 
The "Credit Card" payment option is displayed by default. 
The "select method" option is disabled; user must select a payment option to submit the form.
Credit card section div is displayed.
"Paypal" and "Bitcoin" payment sections are hidden.
*/

//"Payment Info" variables
const $paymentMenu = $('#payment option');
const $creditCardInfo = $('#credit-card');
const $payPalInfo = $('#paypal');
const $bitCoinInfo = $('#bitcoin');

$($paymentMenu).eq(1).attr('selected', true);
$($paymentMenu).eq(0).attr('disabled', true); 

$($payPalInfo).hide();
$($bitCoinInfo).hide();

//When "PayPal" payment option is selected, "PayPal" section is displayed, while "Credit Card" and "Bitcoin" sections are hidden.

//When "Bitcoin" payment option is selected, "Bitcoin" section is displayed, while "Credit Card" and "PayPal" sections are hidden.

$('#payment').change(function () {
    $($paymentMenu).eq(1).removeAttr('selected');
    if ($(this).val() === 'PayPal') {
        $($creditCardInfo).hide();
        $($bitCoinInfo).hide();
        $($payPalInfo).show();
    } else if ($(this).val() === 'Bitcoin') {
        $($creditCardInfo).hide();
        $($payPalInfo).hide();
        $($bitCoinInfo).show();
    } else {
        $($payPalInfo).hide();
        $($bitCoinInfo).hide();
        $($creditCardInfo).show();
    }
});

