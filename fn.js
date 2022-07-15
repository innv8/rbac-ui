let rbac = {
    "actions": [],
    "resources": [],
    "roles": []
};

function load() {
    let rbacStr = localStorage.getItem("rbac");
    if (rbacStr != null) {
        rbac = JSON.parse(rbacStr);
        loadRBAC();
    }
}

(function () {

    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event) {
        rbac = JSON.parse(event.target.result);
        loadRBAC();
    }

    document.getElementById('file').addEventListener('change', onChange);

}());

function loadRBAC() {
    localStorage.setItem("rbac", JSON.stringify(rbac));

    showActions();
    showResources();
    showRoles();
    showGrants();
}

function saveAction() {
    let action = document.getElementById("new-action");
    rbac.actions.push(action.value);
    loadRBAC();
    action.value = ""
    return false;
}

function saveRole() {
    let role = document.getElementById("new-role");
    rbac.roles.push({
        "id": role.value,
        "grants": [],
    })
    loadRBAC();
    role.value = ""
    return false;
}

function saveResource() {
    let resourceID = document.getElementById("new-resource-id");
    let resourceRegex = document.getElementById("new-resource-regex");
    let resource = {
        "id": resourceID.value,
        "regex": resourceRegex.value
    }
    rbac.resources.push(resource);
    loadRBAC();
    resourceID.value = "";
    resourceRegex.value = "";
    return false;
}

function clearAll() {
    localStorage.clear()
    rbac = {
        "actions": [],
        "resources": [],
        "roles": []
    };
    loadRBAC();
}


// -- printing on page
function showActions() {

    let actionList = '';
    let counter = 1;
    for (let action of rbac.actions) {
        actionList += `<tr><td>${counter}</td> <td>${action}</td></tr>`;
        counter += 1
    }
    document.getElementById("action-list").innerHTML = actionList;
}

function showResources() {
    let resourceList = '';
    let counter = 1;
    for (let resource of rbac.resources) {
        resourceList += `<tr>
        <td>${counter}</td>
        <td>${resource.id}</td>
        <td>${resource.regex}</td></tr>`;
        counter += 1
    }
    document.getElementById("resource-list").innerHTML = resourceList;
}

function showRoles() {
    let roleList = '';
    let counter = 1;

    for (let role of rbac.roles) {
        roleList += `<tr>
        <td>${counter}</td>
        <td>${role.id}</td>
        </tr>`;
        counter += 1;
    }
    document.getElementById("role-list").innerHTML = roleList;
}

function showGrants() {
    let grantList = '';
    let counter = 1;

    for (let role of rbac.roles) {
        let text = ` <div class="accordion-item accordion-flush">`
        text += `
        <h2 class="accordion-header" id="heading${role.id}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${role.id}" aria-expanded="false" aria-controls="collapse${role.id}">
           ${counter}. ${role.id}
            </button>
      </h2>`

        text += `<div id="collapse${role.id}" class="accordion-collapse collapse " aria-labelledby="heading${role.id}" data-bs-parent="#accordionExample">
      <div class="accordion-body">`;

        text += `
      <table class="table table-stripped table-bordered">
        <thead>
            <tr>
                <th>Resource</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`

        for (let grant of role.grants) {
            text += `
        <tr>
            <td>${grant.resource}</td>
            <td>${grant.actions}</td>
        </tr>`
        }

        text += `</tbody></table>`

        text += `</div>
    </div>`

        counter += 1
        grantList += text
    }

    document.getElementById("grant-list").innerHTML = grantList;
    console.log(grantList)
}