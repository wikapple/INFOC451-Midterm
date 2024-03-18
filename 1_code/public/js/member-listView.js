jQuery(document).ready(function () {
    updateMemberTable();
    
    jQuery('#search-btn').click(function () {
        const searchValue = jQuery('#search-member-input').val();
        updateMemberTable(searchValue);
    });

    jQuery('#search-member-input').keypress(function (event) {
        if (event.which === 13) {
            const searchValue = jQuery('#search-member-input').val();
            updateMemberTable(searchValue);
        }

    });

    jQuery('#clear-search-btn').click(function () {
        jQuery('#search-member-input').val('');
        updateMemberTable();
    });

});

function updateMemberTable(filter = '') {

    jQuery.ajax({
        url: `api/member?filter=${filter}`,
        method: 'GET',
        success: function (response) {
            jQuery('#member-table tbody').empty();

            jQuery.each(response, function (index, member) {
                var row = jQuery('<tr>');
                row.append(jQuery('<td>').text(member.name));
                row.append(jQuery('<td>').text(member.phoneNumber));
                row.append(jQuery('<td>').text(member.email));
                row.append(jQuery('<td>').html(member.isFrozen ? `<p class="text-danger">Frozen</p>` : `<p class="text-success">Active</p>`));
                row.append(jQuery('<td>').html(member.balance < 0 ? `<p class="text-danger">Yes</p>` : `<p class="text-success">No</p>`));
                row.append(jQuery('<td>').text('0'));
                row.append(jQuery('<td>').html(`<a href="/member/${member.id}" class="btn btn-outline-info"><i class="fa-solid fa-address-card"></i> View Details</a>`));
                jQuery('#member-table tbody').append(row);
            });
        },
        error: function (xhr, status, error) {
            console.log(error?.message);
        }
    });
}