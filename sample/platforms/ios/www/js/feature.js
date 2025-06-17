// Feature list for different screens
const featureData = {
    "index.html": [
        {
            title: "Features",
            list: [
                { text: "Identification", link: "identification.html" },
                { text: "Push Notification", link: "pushNotifications.html" },
                { text: "Support", link: "support.html" },
                { text: "Session Analytics", link: "sessionAnalytics.html" }
            ]
        },
        {
            title: "Debug",
            list: [
                {
                    text: "Force a crash",
                    action: () =>  DevRev.crash()
                },
                {
                    text: "Trigger ANR",
                    action: () => {
                        if (cordova.platformId === 'android') {
                            const startTime = Date.now();
                            while (Date.now() - startTime < 5000) {
                            }
                        }
                    },
                    condition: () => cordova.platformId === 'android'
                }
            ]
        }
    ],
    "identification.html": [
        { title: "Logout",
            list: [
                { text: "Logout", action: () => logout() }
            ]
        }
    ],
    "pushNotifications.html": [
        { title: "Push Notifications",
            list: [
                { text: "Register for Push Notifications", action: () => registerDevice() },
                { text: "Unregister from Push Notifications", action: () => unregisterDevice() }
            ]
        }
    ],
    "support.html": [
        { title: "Support",
            list: [
                { text: "Support Chat", action: () => DevRev.createSupportConversation() },
                { text: "Support View", action: () => DevRev.showSupport() }
            ]
        }
    ],

    "sessionAnalytics.html": [
        { title: "Session Monitoring",
            list: [
                { text: "Stop Monitoring", action: () => {
                    DevRev.stopAllMonitoring(
                        () => alert("Monitoring stopped successfully"),
                        (error) => alert("Failed to stop monitoring: " + error)
                    );
                }},
                { text: "Resume Monitoring", action: () => {
                    DevRev.resumeAllMonitoring(
                        () => alert("Monitoring resumed successfully"),
                        (error) => alert("Failed to resume monitoring: " + error)
                    );
                }}
            ]
        },
        {
            title: "Session Recording",
            list: [
                { text: "Start Recording", action: () => {
                    DevRev.startRecording(
                        () => alert("Recording started successfully"),
                        (error) => alert("Failed to start recording: " + error)
                    );
                }},
                { text: "Stop Recording", action: () => {
                    DevRev.stopRecording(
                        () => alert("Recording stopped successfully"),
                        (error) => alert("Failed to stop recording: " + error)
                    );
                }},
                { text: "Pause Recording", action: () => {
                    DevRev.pauseRecording(
                        () => alert("Recording paused successfully"),
                        (error) => alert("Failed to pause recording: " + error)
                    );
                }},
                { text: "Resume Recording", action: () => {
                    DevRev.resumeRecording(
                        () => alert("Recording resumed successfully"),
                        (error) => alert("Failed to resume recording: " + error)
                    );
                }}
            ]
        },
        {
            title: "Timer with Properties",
            list: [
                { text: "Start Timer", action: () => {
                    let properties = {"id": "foo-bar-123"};
                    DevRev.startTimerWithProperties("Sample Timer", properties,
                        () => alert("Timer started successfully"),
                        (error) => alert("Failed to start timer with properties: " + error)
                    );
                }},
                { text: "End Timer", action: () => {
                    let properties = {"id": "foo-bar-123"};
                    DevRev.endTimerWithProperties("Sample Timer", properties,
                        () => alert("Timer ended successfully"),
                        (error) => alert("Failed to end timer with properties: " + error)
                    );
                }}
            ]
        },
        {
            title: "On-Demand Session",
            list: [
                { text: "Process On-Demand Session", action: () => {
                    DevRev.processAllOnDemandSessions(
                        () => alert("On-demand sessions processed successfully"),
                        (error) => alert("Failed to process on-demand sessions: " + error)
                    );
                }}
            ]
        },
        {
            title: "Delayed Screen",
            list: [
                { text: "Go To Delayed Screen", link: "delayedScreen.html" },
            ],
            condition: () => cordova.platformId === 'android'
        }
    ]
};

let currentUserId = null;

function logout() {
    if(device.uuid) {
        DevRev.logout(device.uuid,
            () => alert("Logged out successfully"),
            (error) => alert("Failed to logout: " + error)
        );
    } else {
        alert("Device UUID not found");
    }
}

function forceCrash() {
    forceCrash();
}

async function registerDevice() {
    try {
        if (!window.device?.uuid) {
            alert('Device UUID not available');
            return;
        }
        await cordova.plugins.firebase.messaging.requestPermission();

        const token = await cordova.plugins.firebase.messaging.getToken();
        if (!token) {
            alert('Failed to retrieve device token');
            return;
        }

        console.log("Got device token:", token);
        DevRev.registerDeviceToken(token, window.device.uuid,
            () => alert('Device registered successfully for push notifications'),
            (error) => alert('Failed to register device: ' + error)
        );

    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed: ' + error.message);
    }
}

async function unregisterDevice() {
    if (!window.device?.uuid) {
        alert('Device UUID not available');
        return;
    }

    DevRev.unregisterDevice(window.device.uuid,
        () => alert('Device unregistered successfully from push notifications'),
        (error) => alert('Failed to unregister device: ' + error)
    );
}

function renderFeatureList() {
    const list = document.getElementById("featureList");
    if (!list) return;

    const screen = window.location.pathname.split("/").pop();
    const featureList = featureData[screen] || [];

    list.innerHTML = "";

    featureList.forEach(section => {
        if(section.condition && !section.condition()) {
            return
        }
        if (section.title) {
            const header = document.createElement("h3");
            header.textContent = section.title;
            list.appendChild(header);
        }

        if (section.list) {
            section.list.forEach(item => {
                // Skip items that don't meet their condition
                if (item.condition && !item.condition()) {
                    return;
                }

                const li = document.createElement("li");
                li.style.cursor = "pointer";

                if (item.link) {
                    li.addEventListener("click", () => {
                        window.location.href = item.link;
                    });
                } else if (item.action) {
                    li.addEventListener("click", (e) => {
                        e.preventDefault();
                        item.action();
                        console.log(`"${item.text}" executed successfully.`);
                    });
                }

                const a = document.createElement("a");
                a.textContent = item.text;
                a.href = item.link || "#";
                a.style.pointerEvents = "none";
                a.style.textDecoration = "none";
                a.style.color = "inherit";

                li.appendChild(a);
                list.appendChild(li);
            });
        }
    });
}

document.getElementById('identifyUser').addEventListener('click', function(e) {
    e.preventDefault();
    const userId = document.getElementById('unverifiedUserId').value;
    if (userId) {
        currentUserId = userId;
        DevRev.identifyUser(userId);
    }
});

document.getElementById('verifyUser').addEventListener('click', function(e) {
    e.preventDefault();
    const userId = document.getElementById('verifiedUserId').value;
    const sessionToken = document.getElementById('sessionToken').value;
    if (userId && sessionToken) {
        currentUserId = userId;
        DevRev.verifyUser(userId, sessionToken);
    }
});

document.getElementById('updateUser').addEventListener('click', function(e) {
    e.preventDefault();
    if (!currentUserId) {
        alert('Please identify or verify a user first');
        return;
    }

    const displayName = document.getElementById('displayName').value;
    const email = document.getElementById('email').value;

    const identity = {
        userID: currentUserId,
        userTraits: {
            displayName: displayName,
            email: email
        }
    };

    DevRev.updateUser(identity);
});

document.addEventListener("DOMContentLoaded", function() {
    renderFeatureList();

    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "sessionAnalytics.html") {
        const properties = {
            "page": "session_analytics",
            "timestamp": new Date().toISOString()
        };
        DevRev.addSessionProperties(properties,
            () => console.log("Session properties added successfully"),
            (error) => console.error("Failed to add session properties:", error)
        );
        DevRev.trackScreenName("session-analytics",
            () => console.log("Screen name tracked successfully"),
            (error) => console.error("Failed to track screen name:", error)
        );
    }
});
