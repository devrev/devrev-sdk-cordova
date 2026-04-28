var capturedImages = [];
var capturedImageSources = new Set();

document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }
});

// Cordova Device Ready Event
document.addEventListener('deviceready', function() {
    const deviceReadyElement = document.getElementById('deviceready');
    deviceReadyElement?.classList.add('ready');

    deviceReadyElement?.classList.add('configuring');
    DevRev.configure('<APPID>', function() {
        console.log('DevRev SDK configured successfully.');
        deviceReadyElement?.classList.remove('configuring');
        deviceReadyElement?.classList.add('configured');
    }, function(error) {
        console.error('Failed to configure DevRev SDK:', error);
        deviceReadyElement?.classList.remove('configuring');
        deviceReadyElement?.classList.add('error');
    });

    cordova.plugins.firebase.messaging.requestPermission();

    cordova.plugins.firebase.messaging.getToken().then(function(token) {
        console.log('Got device token: ', token);
    });
    cordova.plugins.firebase.messaging.onTokenRefresh(function(refreshedToken) {
        console.log('Refreshed FCM token:', refreshedToken);
    });

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}, false);

function takePicture() {
    if(!navigator.camera) {
        console.log('Camera Plugin not available');
        return;
    }
    navigator.camera.getPicture(onCameraSuccess, onPhotoError, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: false,
        targetWidth: 800,
        targetHeight: 800
    });
}

function selectFromGallery() {
    var galleryStartTime = performance.now();
    if(navigator.camera) {
        navigator.camera.getPicture(function(imageData) {
            onGallerySuccess(imageData);
            console.log('[Gallery] Time to load: ' + Math.round(performance.now() - galleryStartTime) + 'ms (1 image)');
        }, onPhotoError, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth: 800,
            targetHeight: 800
        });
    } else {
        console.log('No gallery plugin available');
    }
}

function onCameraSuccess() {
    console.log('onCameraSuccess called');
}

function onGallerySuccess(imageData) {
    console.log('onGallerySuccess called');
    var dataUrl = imageData.startsWith('data:') ? imageData : 'data:image/jpeg;base64,' + imageData;
    if(capturedImageSources.has(dataUrl)) {
        console.log('Skipping duplicate image');
        return;
    }
    capturedImageSources.add(dataUrl);
    capturedImages.push(dataUrl);
    appendImageToGrid(dataUrl);
}

function appendImageToGrid(imageData) {
    var imagePreview = document.getElementById('imagePreview');
    var imageGrid = document.getElementById('imageGrid');

    if(!imagePreview || !imageGrid) {
        console.error('Image display elements not found');
        return;
    }

    imagePreview.style.display = 'block';
    imageGrid.appendChild(createGalleryItem(imageData, capturedImages.length - 1));
}

function displayImages() {
    var imagePreview = document.getElementById('imagePreview');
    var imageGrid = document.getElementById('imageGrid');
    if(!imagePreview || !imageGrid) return;

    imageGrid.innerHTML = '';
    if(capturedImages.length === 0) {
        imagePreview.style.display = 'none';
        return;
    }
    imagePreview.style.display = 'block';
    capturedImages.forEach(function(imageData, index) {
        imageGrid.appendChild(createGalleryItem(imageData, index));
    });
}

function createGalleryItem(imageData, index) {
    var imageContainer = document.createElement('div');
    imageContainer.className = 'gallery-item';

    var img = document.createElement('img');
    img.src = imageData;
    img.classList.add('devrev-mask');

    var removeBtn = document.createElement('button');
    removeBtn.innerHTML = '&times;';
    removeBtn.className = 'gallery-item-remove';
    removeBtn.onclick = function() { removeImage(index); };

    imageContainer.appendChild(img);
    imageContainer.appendChild(removeBtn);
    return imageContainer;
}

function clearAllImages() {
    capturedImages.length = 0;
    capturedImageSources.clear();
    var imagePreview = document.getElementById('imagePreview');
    var imageGrid = document.getElementById('imageGrid');
    if(imageGrid) imageGrid.innerHTML = '';
    if(imagePreview) imagePreview.style.display = 'none';
}

function removeImage(index) {
    capturedImages.splice(index, 1);
    capturedImageSources.clear();
    capturedImages.forEach(function(dataUrl) { capturedImageSources.add(dataUrl); });
    displayImages();
    console.log('Image removed at index:', index);
}

function onPhotoError(message) {
    var msg = String(message || '');
    if(msg && (msg.toLowerCase().includes('cancel') ||
               msg.toLowerCase().includes('no image') ||
               msg === 'Camera cancelled.' ||
               msg === 'Selection cancelled.')) {
        console.log('Image selection cancelled by user');
        return;
    }
    if(msg) {
        alert('Failed to load image: ' + msg);
        console.error('Camera error: ' + msg);
    }
}
