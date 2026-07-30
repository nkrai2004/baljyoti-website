/*
=========================================================
BJ ONE ERP
Admission Module
Version : 1.0
=========================================================
*/

"use strict";

const Admission = {

    admissions: [],

    init() {

        this.setToday();

        this.generateAdmissionNo();

        this.bindPhotoPreview();

        this.loadAdmissions();

    },

    setToday() {

        const today = new Date().toISOString().split("T")[0];

        const dateBox = document.getElementById("admissionDate");

        if (dateBox) {

            dateBox.value = today;

        }

    },

    generateAdmissionNo() {

        const no =
            "BJPS" +
            Date.now().toString().slice(-8);

        const box =
            document.getElementById("admissionNo");

        if (box) {

            box.value = no;

        }

    },

    bindPhotoPreview() {

        const file =
            document.getElementById("photo");

        if (!file) return;

        file.addEventListener("change", e => {

            const selected =
                e.target.files[0];

            if (!selected) return;

            const reader = new FileReader();

            reader.onload = function(ev) {

                let preview =
                    document.getElementById("photoPreview");

                if (!preview) {

                    preview =
                        document.createElement("img");

                    preview.id = "photoPreview";

                    preview.style.width = "120px";

                    preview.style.marginTop = "10px";

                    file.parentNode.appendChild(preview);

                }

                preview.src = ev.target.result;

            };

            reader.readAsDataURL(selected);

        });

    },

    collectData() {

        return {

            admissionNo:
                document.getElementById("admissionNo").value,

            admissionDate:
                document.getElementById("admissionDate").value,

            studentName:
                document.getElementById("studentName").value.trim(),

            gender:
                document.getElementById("gender").value,

            dob:
                document.getElementById("dob").value,

            studentClass:
                document.getElementById("studentClass").value,

            fatherName:
                document.getElementById("fatherName").value,

            motherName:
                document.getElementById("motherName").value,

            mobile:
                document.getElementById("mobile").value,

            email:
                document.getElementById("email").value,

            address:
                document.getElementById("address").value

        };

    },

    validate(data) {

        if (data.studentName === "") {

            alert("Enter Student Name");

            return false;

        }

        if (data.mobile === "") {

            alert("Enter Mobile Number");

            return false;

        }

        return true;

    },

    async save() {

        const data =
            this.collectData();

        if (!this.validate(data)) {

            return;

        }

        const result =
            await API.createAdmission(data);

        if (result.success) {

            alert("Admission Saved Successfully");

            document
                .getElementById("admissionForm")
                .reset();

            this.setToday();

            this.generateAdmissionNo();

            this.loadAdmissions();

        }

        else {

            alert(result.message || "Unable to Save");

        }

    },

    async loadAdmissions() {

        const tbody =
            document.querySelector(
                "#admissionTable tbody"
            );

        if (!tbody) return;

        const result =
            await API.getAdmissions();

        tbody.innerHTML = "";

        if (!result.success) {

            return;

        }

        this.admissions =
            result.data || [];

        this.admissions.forEach(item => {

            tbody.innerHTML += `

<tr>

<td>${item.admissionNo}</td>

<td>${item.studentName}</td>

<td>${item.studentClass}</td>

<td>${item.mobile}</td>

<td>

<button class="btn-sm btn-edit"
onclick="Admission.edit('${item.admissionNo}')">

Edit

</button>

<button class="btn-sm btn-delete"
onclick="Admission.remove('${item.admissionNo}')">

Delete

</button>

</td>

</tr>

`;

        });

    },

    edit(id) {

        alert(
            "Edit Module Coming Soon\nAdmission : " + id
        );

    },

    async remove(id) {

        if (!confirm("Delete this Admission?")) {

            return;

        }

        const result =
            await API.deleteAdmission(id);

        if (result.success) {

            this.loadAdmissions();

        }

        else {

            alert(result.message);

        }

    },

    search(keyword) {

        keyword =
            keyword.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#admissionTable tbody tr"
            );

        rows.forEach(row => {

            const text =
                row.innerText.toLowerCase();

            row.style.display =
                text.includes(keyword)
                ? ""
                : "none";

        });

    }

};

window.addEventListener("load", function () {

    if (document.getElementById("admissionForm")) {

        Admission.init();

    }

});
