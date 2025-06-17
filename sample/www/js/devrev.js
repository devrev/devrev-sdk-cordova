function configureSDK() {
    DevRev.configure('<APPID>', function() {
        console.log('DevRev SDK configured successfully.');
        window.location.href = "identification.html";
    }, function(error) {
        console.error('Failed to configure DevRev SDK:', error);
    });
}

function identifyUnverifiedUser() {
    var identity = { userID: '42538593' };

    DevRev.identifyUnverifiedUser(identity, function() {
        console.log('User identified successfully.');
    }, function(error) {
        console.error('Failed to identify user:', error);
    });
}

function showSupport() {
    DevRev.showSupport();
}
