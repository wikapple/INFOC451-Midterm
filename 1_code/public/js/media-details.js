jQuery(document).ready(function () {
jQuery('#confirm-delete-media-btn').click(function() {
    const button = $('#delete-media-btn');
    const mediaIdSelected = button.data('id');
    jQuery.ajax({
        type: 'DELETE',
        url: `/api/media/${mediaIdSelected}`,
        success: function(response) {

          jQuery('#delete-confirmation-modal').modal('hide');
          window.location.replace('/media');
        },
        error: function(xhr, status, error) {
          console.error('Error deleting row:', error);
         
        }
      });
});

jQuery('#create-copy-modal').on('hidden.bs.modal', function () {
  jQuery('#create-item-modal-form')[0].reset();
});

jQuery('#submit-new-copy-btn').click(function() {
  jQuery('#create-item-modal-form').submit();
});

jQuery('#create-item-modal-form').submit(function(event) {
  event.preventDefault();

  if(this.checkValidity() === false) {
      event.stopPropagation();
  } else {
      jQuery.ajax({
          type: 'POST',
          url: '/item',
          data: jQuery('#create-item-modal-form').serialize(),
          success: function(response) {
              console.log("copy added successful");
              updateCopyTable();
          },
          error: function(xhr, status, error) {
              console.error('Failed to add or update media');
          }
      });
  }
  jQuery(this).addClass('was-validated');
  jQuery('#create-rental-item-modal').modal('hide');
});
});

function updateCopyTable() {
  const baseItemId = jQuery('#id').val();
  jQuery.ajax({
    url: `/api/item/baseItem/${baseItemId}`,
    method: 'GET',
    success: function (response) {
        jQuery('#copy-table tbody').empty();

        jQuery.each(response, function (index, copy) {
            var row = jQuery('<tr>');
            row.append(jQuery('<td>').text(copy.rentalItemGuid));
            row.append(jQuery('<td>').text(copy.itemCondition));
            row.append(jQuery('<td>').html(`<span class="${copy.isAvailable? 'text-success':'text-danger'}">${copy.isAvailable ? 'Yes' : 'No'}</span>`));
            row.append(jQuery('<td>').html(`<a href="/item/${copy.rentalItemGuid}" class="btn btn-outline-info"><i class="fa-solid fa-circle-info"></i> View Rental Item</a>`));
            jQuery('#copy-table tbody').append(row);
        });

        const totalAvailable = response.filter(item => item.isAvailable).length;
        jQuery('#totalAvailableCount').text(totalAvailable);
        const total = response.length;
        jQuery('#totalCount').text(total);

        if(totalAvailable) {
          jQuery('#totalAvailableCount').removeClass('text-danger');
          jQuery('#totalAvailableCount').addClass('text-success');
          jQuery('#totalCount').removeClass('text-danger');
          jQuery('#totalCount').addClass('text-success');
        }
        else {
          jQuery('#totalAvailableCount').removeClass('text-success');
          jQuery('#totalAvailableCount').addClass('text-danger');
          jQuery('#totalCount').removeClass('text-success');
          jQuery('#totalCount').addClass('text-danger');
        }
    },
    error: function (xhr, status, error) {
        console.log(error?.message);
    }
});
}