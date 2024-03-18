
jQuery(document).ready(function () {
    updateMemberSearchResults();

    jQuery('#complete-checkout-btn').click(function () {
        const userId = jQuery('#user-id').val();
        const checkoutDate = new Date().toISOString().split('T')[0];
        const rentalAgreements = getItemTableData();


        jQuery.ajax({
            url: '/api/rentalagreement/checkout',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                userId: userId,
                checkoutDate: checkoutDate,
                rentalAgreements: rentalAgreements
            }),
            success: function (response) {
                window.location.replace('/media');
            },
            error: function (xhr, status, error) {
                console.log("Checkout failure");
                console.log(xhr.responseText);
            }
        });
    });

    jQuery('#search-member-btn').click(function () {
        const searchValue = jQuery('#search-member-input').val();
        updateMemberSearchResults(searchValue);
    });

    jQuery('#search-member-input').keypress(function (event) {
        if (event.which === 13) {
            const searchValue = jQuery('#search-member-input').val();
            updateMemberSearchResults(searchValue);
        }

    });

    jQuery('#clear-member-search-btn').click(function () {
        jQuery('#search-member-input').val('');
        updateMemberSearchResults();
    });

    jQuery('#search-item-btn').click(function () {
        const searchValue = jQuery('#search-item-input').val();
        updateItemSearchResults(searchValue);
    });

    jQuery('#search-item-input').keypress(function (event) {
        if (event.which === 13) {
            const searchValue = jQuery('#search-item-input').val();
            updateItemSearchResults(searchValue);
        }

    });

    jQuery('#clear-item-search-btn').click(function () {
        jQuery('#search-item-input').val('');
        updateItemSearchResults();
    });

    jQuery('#item-select-modal').on('shown.bs.modal', function () {
        initializeScanner();

    });
    jQuery('#item-select-modal').on('hidden.bs.modal', function () {
        jQuery('#search-item-input').val('');
        updateItemSearchResults();
    });

    jQuery('#item-table').on('click', '.remove-item-btn', function () {
        jQuery(this).closest('tr').remove();
    })

});

async function initializeScanner() {
    jQuery('#qrcode-spinner').show();
    let cameras = await Html5Qrcode.getCameras();
    let camera = cameras[0];

    const scanner = new Html5Qrcode('rentalItemQrcodeReader');
    scanner.start(
        camera.id,
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            // action on success
            processRentalItemId(decodedText);
            scanner.stop().then((ignore) => {
                // What to do when scanner stops
            }).catch((err) => {
                // What to do when scanner stopping causes an error
            });

        },
        (errorMessage) => {
            // error 
            //console.log(errorMessage);
        })
        .catch((err) => {
            console.log(err);
        }).then(() => {
            jQuery('#qrcode-spinner').hide();
        });


}

function updateMemberSearchResults(filter = undefined) {
    const resultsContainer = jQuery('#member-search-results');

    if (!filter) {
        resultsContainer.html(`<div class="text-center">None</div>`);
    }
    else {
        jQuery.ajax({
            url: `/api/member?filter=${filter}`,
            method: 'GET',
            success: function (response) {
                resultsContainer.empty();

                if (response.length >= 10) {
                    resultsContainer.html(`<p class="lead">Please refine your search. Search returned 10 or more results</p>`);
                }
                if (response.length == 0) {
                    resultsContainer.html(`<div class="text-center">No matchings members found.</div>`);
                }

                jQuery.each(response, function (index, member) {
                    buttonText = `<div class="row">
                    <div class="col-12 mb-1">
                         Id: <strong>${member.userId}</strong>
                    </div>
                    <div class="col-md-12" mb-1>
                    name: <strong>${member.name}</strong>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-12 mb-1">
                     email: <strong>${member.email}</strong> 
                     </div>
                     <div class="col-md-12">
                      phone-number: <strong>${member.phoneNumber}</strong>
                      </div>
                      </div>`;

                    let button = jQuery('<button>', {
                        html: buttonText,
                        click: function () {
                            selectMember(member);
                        },
                        class: 'btn btn-outline-info btn-block mb-2 member-select-btn'
                    });

                    resultsContainer.append(button);
                })
            },
            error: function (xhr, status, error) {
                console.log(error?.message);
            }
        });
    }


}

function selectMember(member) {

    jQuery('#checkout-member-form input[name="userId"]').val(member.userId);
    jQuery('#checkout-member-form input[name="name"]').val(member.name);
    jQuery('#checkout-member-form input[name="phoneNumber"]').val(member.phoneNumber);
    jQuery('#checkout-member-form input[name="email"]').val(member.email);
    jQuery('#checkout-member-form').show();
    jQuery('#member-select-modal').modal('hide');
    jQuery('#search-member-input').val('');
    updateMemberSearchResults();

}

function updateItemSearchResults(filter = undefined) {
    const resultsContainer = jQuery('#item-search-results');

    if (!filter) {
        resultsContainer.html(`<div class="text-center">None</div>`);
    }
    else {
        jQuery.ajax({
            url: `/api/item?filter=${filter}`,
            method: 'GET',
            success: function (response) {

                response = response.filter(x => !x.isCheckedOut && !x.isOnHold);

                resultsContainer.empty();

                if (response.length >= 10) {
                    resultsContainer.html(`<p class="lead">Please refine your search. Search returned 10 or more results</p>`);
                    return;
                }
                if (response.length == 0) {
                    resultsContainer.html(`<div class="text-center">No matchings rental items found.</div>`);
                    return;
                }

                jQuery.each(response, function (index, rentalItem) {
                    buttonText = `<div class="row">
                    <div class="col-12 mb-1">
                         Id: <strong>${rentalItem.rentalItemGuid}</strong>
                    </div>
                    <div class="col-md-12" mb-1>
                    name: <strong>${rentalItem.name}</strong>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-12 mb-1">
                     item type: <strong>${rentalItem.itemType}</strong> 
                     </div>
                      </div>`;

                    let button = jQuery('<button>', {
                        html: buttonText,
                        click: function () {
                            selectItem(rentalItem);
                        },
                        class: 'btn btn-outline-info btn-block mb-2 item-select-btn'
                    });

                    resultsContainer.append(button);
                })
            },
            error: function (xhr, status, error) {
                console.log(error?.message);
            }
        });
    }
}

function getDateStringFormattedForInput(date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear() + "-" + month + "-" + day;
}

function selectItem(rentalItem) {

    let currentDate = new Date();
    currentDate = getDateStringFormattedForInput(currentDate);
    let twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    twoWeeksFromToday = getDateStringFormattedForInput(twoWeeksFromToday);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = getDateStringFormattedForInput(tomorrow);

    var currentDateInputField = $('<input>', {
        id: 'checkoutDateInput',
        type: 'date',
        class: 'form-control',
        value: currentDate,
        disabled: true
    });
    var twoWeeksLaterInputField = $('<input>', {
        id: 'twoWeeksLaterInput',
        type: 'date',
        class: 'form-control',
        value: twoWeeksFromToday,
        disabled: false,
        min: tomorrow
    });
    let row = jQuery('<tr>');
    row.append(jQuery('<td>').text(rentalItem.rentalItemGuid));
    row.append(jQuery('<td>').text(rentalItem.name));
    row.append(jQuery('<td>').text(rentalItem.itemType));
    row.append(jQuery('<td>').append(currentDateInputField));
    row.append(jQuery('<td>').append(twoWeeksLaterInputField));
    row.append(jQuery('<td>').html(`<button class="btn btn-outline-danger remove-item-btn">Remove Item</button>`));
    jQuery('#item-table tbody').append(row);

    jQuery('#item-select-modal').modal('hide');
    jQuery('#search-item-input').val('');
}

async function processRentalItemId(rentalItemId) {
    jQuery.ajax({
        url: `/api/item/${rentalItemId}`,
        method: 'GET',
        success: function (response) {
            if (response) {

                if (response.isCheckedOut) {
                    jQuery('#qr-error-message').text("Item is already checked out");
                    jQuery('#qr-error-message').show(500);
                    initializeScanner();
                }
                else if (response.isOnHold) {
                    jQuery('#qr-error-message').text("Item is on hold");
                    jQuery('#qr-error-message').show(500);
                    initializeScanner();
                }
                else if (isItemAlreadySelected(response.rentalItemGuid)) {
                    jQuery('#qr-error-message').text("Item is already selected");
                    jQuery('#qr-error-message').show(500);
                    initializeScanner();
                }
                else {
                    jQuery('#qr-error-message').text('');
                    jQuery('#qr-error-message').hide(200);
                    selectItem(response);
                }

            } else {
                // What to do if no valid rental item is returned?

            }
        },
        error: function (error) {
            initializeScanner();
            // What to do on an api error
        }
    });
}

function isItemAlreadySelected(rentalItemId) {
    const selectedData = getItemTableData();

    return selectedData.some(x => x.rentalItemId == rentalItemId);
}

function getItemTableData() {
    let itemData = [];

    jQuery('#item-table tbody tr').each(function () {
        let rowData = {};

        rowData.rentalItemId = jQuery(this).find('td:eq(0)').text();
        rowData.returnDate = jQuery(this).find('td:eq(4) input[type="date"]').val();
        itemData.push(rowData);
    });
    return itemData;
}