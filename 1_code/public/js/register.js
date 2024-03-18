jQuery(document).ready(function() {
    jQuery('#registerForm').submit(function(event) {
        event.preventDefault();

        var password = jQuery('#password').val();
        var confirmPassword = jQuery('#passwordConfirmation').val();

        if(password !== confirmPassword) {
            jQuery('#error').show();
        } else {
            jQuery('#error').hide();
            jQuery(this).unbind('submit').submit();
        }
    })
});