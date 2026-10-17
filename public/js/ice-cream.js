document.getElementById("ice-cream-form").onsubmit = () => {
    // Clear all errors
    clearErrors();

    let isValid = true;

    // Validate First Name
    let name = document.getElementById("name").value.trim();
    if (name === ""){
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }
    // Validate Email
    let email = document.getElementById('email').value.trim();
    if (!email || email.indexOf("@") === -1) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    // Validate flavor
    let flavor = document.getElementById("flavor").value;
    if (flavor === "none") {
        document.getElementById("err-flavor").style.display == "block";
        isValid = false;
    }


    // Validate method Cone Type
    let methodButtons = document.getElementsByName("method");
    let methodSelected = false
    for (let i = 0; i < methodButtons.length; i++) {
        if (methodButtons[i].checked) {
            methodSelected = true
            
        }
    }
    if (!methodSelected) {
        document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    return isValid;
};

function clearErrors() {
    let errors = document.getElementsByClassName("error");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}