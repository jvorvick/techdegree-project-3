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



/*
Below the checkboxes, the total cost of all selected activities is displayed when a checkbox is selected.
The total cost is updated each time a checkbox is selected or deselected.
*/
