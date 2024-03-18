
jQuery(document).ready(function () {
    let categories = getCheckedCategories();
    jQuery('#input-category-filter').on('keyup', function () {
        const filterText = jQuery(this).val();
        filterCategoriesDisplayed(filterText);
    });

    jQuery('#category-select-modal').on('hidden.bs.modal', function (event) {
        categories = getCheckedCategories();

    });


    jQuery('#create-or-update-form').submit(function (event) {
        event.preventDefault();

        let form = jQuery(this);
        let categories = getCheckedCategories();

        form.find('.hidden-category-list').remove();
        jQuery.each(categories, function (index, category) {
            form.append(jQuery('<input class="hidden-category-list">')
                .attr('type', 'hidden')
                .attr('name', 'categories[]')
                .val(category));
        });

        let formData = form.serialize();
        jQuery.ajax({
            url: "/media",
            method: "POST",
            data: formData,
            success: function (response, textStatus, xhr) {

                window.location.replace(`/media`);
            },

            error: function (xhr, status, error) {
                console.log('Error:', error);
            }
        });
    });

   
});

function clearFilter() {
    jQuery('#input-category-filter').val('');
    filterCategoriesDisplayed();
}

function filterCategoriesDisplayed(filterText = '') {
    jQuery('.category-row').each(function () {
        const rowValue = jQuery(this).find('label').text();

        if (filterText.length == 0 || rowValue.toLowerCase().includes(filterText.toLowerCase())) {
            jQuery(this).show();
        } else {
            jQuery(this).hide();
        }
    });
}

function getCheckedCategories() {
    let selectedCategories = [];
    jQuery('.category-row').each(function () {
        const rowCheckbox = jQuery(this).find('input[type="checkbox"]');

        if (rowCheckbox.prop('checked')) {
            selectedCategories.push(rowCheckbox.attr('name'));
        }
    });
    var pattern = /\d+/;
    selectedCategories = selectedCategories.map(categoryId => categoryId.match(pattern)[0]);
    jQuery('#categories-button').text(`Select categories (${selectedCategories.length} selected)`);
    return selectedCategories;
}


function resetFormButtonClicked() {
    jQuery('#create-or-update-form')[0].reset();
    jQuery('#category-select-form')[0].reset();
    getCheckedCategories();
}

