/* form-validator script: This script loads on the signup page or login page
 * and validates each field of the form, checking for proper email syntax, 
 * proper password length and proper date of birth. 
*/

$(document).ready(function() {
    // Validate Email ID
    $("#email").focusout(function() {
      var emailId   = document.forms["signupForm"]["username"].value;
      var isItEmail = validator.isEmail(emailId); //=> true
      if(!isItEmail) {
        document.getElementById("errorEmail").style.display = "block";
      } else {
        document.getElementById("errorEmail").style.display = "none";
      }
    });

    // Validate password
    $("#password").focusout(function() {
      var password      = document.forms["signupForm"]["password"].value;
      var isItPassword  = validator.isLength(password, 6, 25);
      if(!isItPassword) {
        document.getElementById("errorPassword").style.display = "block";
      } else {
        document.getElementById("errorPassword").style.display = "none";
      }
    });

    // Validate date of birth
    $("#date1").focusout(function() {
      var year        = document.forms["signupForm"]["year"].value;
      var d           = new Date();
      var thisYear    = d.getFullYear();
      var minYear     = thisYear - 16;
      var isUnderage  = false;
      var mydate      = year + "/" + month + "/" + date;
      var isItDateFormat = validator.isDate(mydate);
      if(isItDateFormat) {
        if(year>thisYear) {
          isItDateFormat = false;
        } else if(year > minYear) {
          isUnderage = true;
        } else {
          isUnderage = false;
        }
      }

      if(!isItDateFormat) {
        document.getElementById("errorDateOfBirth").style.display = "block";
      } else {
        document.getElementById("errorDateOfBirth").style.display = "none";
      }

      if(isUnderage) {
        document.getElementById("errorUnderage").style.display = "block";
      } else {
        document.getElementById("errorUnderage").style.display = "none";
      }
    });
});

function validateLoginForm() {
  // Prevent duplicate clicks
  if ( $( "#loginSubmitButton" ).data().isClicked == "Yes" ) {
    return false;
  }
  $( "#loginSubmitButton" ).data( "isClicked", "Yes" );

  var emailId   = document.forms["signupForm"]["username"].value;
  var password  = document.forms["signupForm"]["password"].value;
  var deviceId  = document.forms["signupForm"]["deviceId"].value;
  
  // Validate Email ID
  var isItEmail = validator.isEmail(emailId);
  
  // Validate password
  var isItPassword = validator.isLength(password, 6, 25);
  
  // If any of the fields are invalid, show the appropriate message.
  if(!isItEmail) {
    document.getElementById("errorEmail").style.display = "block";
  } else {
    document.getElementById("errorEmail").style.display = "none";
  }

  if(!isItPassword) {
    document.getElementById("errorPassword").style.display = "block";
  } else {
    document.getElementById("errorPassword").style.display = "none";
  }

  // If there is no device Id then its an error
  if(deviceId) {
    document.getElementById("errorDeviceId").style.display = "none";
  } else {
    document.getElementById("errorDeviceId").style.display = "block";
  }
  
  // submit the form only if all the inputs are right
  if(isItEmail && isItPassword && deviceId) {
    var dataString = 'username='+ emailId + '&password=' + password + '&deviceId=' + deviceId;
    $.ajax({
      type: "POST",
      url: "/login/",
      data: dataString,
      success: function(data, status, jqXHR) {
        data = JSON.parse(data);
        if (data.result === "success" && typeof data.userId !== 'undefined') {
          if(typeof window.JsInterface !== 'undefined') {
            window.JsInterface.goToDealsPage(data.userId);
          } else {
            // User logged in using non-app environment
            document.write("<h1>User with ID "+data.userId+" login Success</h1>");  
          }
        } else {
          document.getElementById("signinForm").submit();
        };
      }
    });
    return false;
  }
}

// Function to validate the signup form fields
function validateSignupForm() {
  // Prevent duplicate clicks
  if ( $( "#signupSubmitButton" ).data().isClicked == "Yes" ) {
    return false;
  }
  $( "#signupSubmitButton" ).data( "isClicked", "Yes" );

  var emailId   = document.forms["signupForm"]["username"].value;
  var password  = document.forms["signupForm"]["password"].value;
  var day       = document.forms["signupForm"]["day"].value;
  var month     = document.forms["signupForm"]["month"].value;
  var year      = document.forms["signupForm"]["year"].value;
  var gender    = document.forms["signupForm"]["gender"].value;
  var location  = document.forms["signupForm"]["location"].value;
  var deviceId  = document.forms["signupForm"]["deviceId"].value;

  var d           = new Date();
  var thisYear    = d.getFullYear();
  var minYear     = thisYear - 16;
  var isUnderage  = false;
  var mydate      = year + "/" + month + "/" + day;
  
  // Validate Email ID
  var isItEmail = validator.isEmail(emailId);
  
  // Validate password
  var isItPassword = validator.isLength(password, 6, 25);
  
  // Validate date of birth
  var isItDateFormat = validator.isDate(mydate);
  
  if(isItDateFormat) {
    if(year > thisYear) {
      isItDateFormat = false;
    } else if(year > minYear) {
      isUnderage = true;
    } else {
      isUnderage = false;
    }
  }

  // If any of the fields are invalid, show the appropriate message.
  if(!isItEmail) {
    document.getElementById("errorEmail").style.display = "block";
  } else {
    document.getElementById("errorEmail").style.display = "none";
  }

  if(!isItPassword) {
    document.getElementById("errorPassword").style.display = "block";
  } else {
    document.getElementById("errorPassword").style.display = "none";
  }

  if(!isItDateFormat) {
    document.getElementById("errorDateOfBirth").style.display = "block";
  } else {
    document.getElementById("errorDateOfBirth").style.display = "none";
  }

  if(isUnderage) {
    document.getElementById("errorUnderage").style.display = "block";
  } else {
    document.getElementById("errorUnderage").style.display = "none";
  }

  // If there is no device Id then its an error
  if(deviceId) {
    document.getElementById("errorDeviceId").style.display = "none";
  } else {
    document.getElementById("errorDeviceId").style.display = "block";
  }

  // submit the form only if all the inputs are right
  if(isItEmail && isItPassword && isItDateFormat && !isUnderage && deviceId) {

    var dataString = $('#signinForm').serialize().replace("%40" , "@");

    // alert(dataString);
    $.ajax({
      type: "POST",
      url: "/signup/",
      data: dataString,
      success: function(data, status, jqXHR) {
        data = JSON.parse(data);
        if (data.result === "success" && typeof data.userId !== 'undefined') {
          if(typeof window.JsInterface !== 'undefined') {
            window.JsInterface.goToDealsPage(data.userId);
          } else {
            // User logged in using non-app environment
            document.write("<h1>User with ID "+data.userId+" login Success</h1>");  
          }
        } else {
          document.getElementById("signinForm").submit();
        };
      }
    });
    return false;
  }
}

// Validate Email ID
function validateResendEmailForm() {
  var emailId   = document.forms["resendValidationMail"]["email"].value;
  var isItEmail = validator.isEmail(emailId);
  if(!isItEmail) {
    document.getElementById("errorResendEmail").style.display = "block";
  } else {
    document.getElementById("errorResendEmail").style.display = "none";
    document.getElementById("resendValidationMail").submit();
  }
}

// Validate Email ID for Forgot Password
function validateForgotPasswordForm() {
  var emailId   = document.forms["forgotPassword"]["email"].value;
  var isItEmail = validator.isEmail(emailId);
  if(!isItEmail) {
    document.getElementById("errorForgotPassword").style.display = "block";
  } else {
    document.getElementById("errorForgotPassword").style.display = "none";
    document.getElementById("forgotPassword").submit();
  }
}

// Validate Password for reset Password
function validateResetPwdForm() {
  var newPwd   = document.forms["resetPassword"]["newPassword"].value;
  var reEnterPwd = document.forms["resetPassword"]["reEnterPassword"].value;
  var isItPwd = validator.isLength(newPwd, 6, 25);
  console.log(newPwd);
  console.log(reEnterPwd);
  if(!isItPwd) {
    document.getElementById("errorResetPassword").style.display = "block";
  } else {
    document.getElementById("errorResetPassword").style.display = "none";
  }
  if(newPwd!==reEnterPwd){
    document.getElementById("errorPwdNoMatch").style.display = "block";
  } else {
    var pwdMatch = 1;
    document.getElementById("errorPwdNoMatch").style.display = "none";
  }
  
  if(pwdMatch && isItPwd){
    document.getElementById("resetPassword").submit();
  }
}

// Validate Password for changing Password Action
function validateChangePwdForm() {
  var oldPwd     = document.forms["changePassword"]["oldPassword"].value;
  var newPwd     = document.forms["changePassword"]["newPassword"].value;
  var reEnterPwd = document.forms["changePassword"]["reEnterPassword"].value;

  var isItPwd1    = validator.isLength(newPwd, 6, 25);
  var isItPwd2    = validator.isLength(oldPwd, 6, 25);

  console.log(newPwd);
  console.log(reEnterPwd);

  if(!isItPwd1 || !isItPwd2) {
    document.getElementById("errorChangePassword").style.display = "block";
  } else {
    document.getElementById("errorChangePassword").style.display = "none";
  }
  if(newPwd == oldPwd){
    var isOldSameAsNew = 1;
    document.getElementById("errorSamePwd").style.display = "block";
  } else {
    document.getElementById("errorSamePwd").style.display = "none";
  }
  if(newPwd!==reEnterPwd){
    document.getElementById("errorPwdNoMatch").style.display = "block";
  } else {
    var pwdMatch = 1;
    document.getElementById("errorPwdNoMatch").style.display = "none";
  }
  
  if(!isOldSameAsNew && pwdMatch && isItPwd1 && isItPwd2){
    document.getElementById("changePassword").submit();
  }
}
