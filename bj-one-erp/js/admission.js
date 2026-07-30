/*
=========================================================
BJ ONE ERP
Admission Module CSS
Version : 1.0
=========================================================
*/

.module-container{
    width:100%;
}

.grid-2{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
}

.grid-3{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}

.form-group{
    display:flex;
    flex-direction:column;
}

.form-group label{
    font-weight:600;
    margin-bottom:8px;
    color:#444;
}

.form-group input,
.form-group select,
.form-group textarea{

    width:100%;
    padding:12px;
    border:1px solid #d5d5d5;
    border-radius:8px;
    font-size:14px;
    transition:.3s;
    background:#fff;

}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus{

    outline:none;
    border-color:#C62828;
    box-shadow:0 0 0 3px rgba(198,40,40,.15);

}

textarea{

    resize:vertical;

}

.photo-box{

    width:150px;
    height:180px;
    border:2px dashed #C62828;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;
    border-radius:10px;
    background:#fafafa;

}

.photo-box img{

    width:100%;
    height:100%;
    object-fit:cover;

}

.action-bar{

    display:flex;
    gap:12px;
    margin-top:25px;
    flex-wrap:wrap;

}

.search-bar{

    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
    gap:15px;
    flex-wrap:wrap;

}

.search-bar input{

    width:320px;
    max-width:100%;

}

#admissionTable{

    width:100%;
    border-collapse:collapse;
    margin-top:15px;

}

#admissionTable th{

    background:#C62828;
    color:#fff;
    padding:12px;
    text-align:left;

}

#admissionTable td{

    padding:12px;
    border-bottom:1px solid #e5e5e5;

}

#admissionTable tbody tr:hover{

    background:#f8f8f8;

}

.table-action{

    display:flex;
    gap:8px;

}

.btn-sm{

    padding:6px 12px;
    font-size:13px;
    border:none;
    border-radius:6px;
    cursor:pointer;

}

.btn-edit{

    background:#1976D2;
    color:#fff;

}

.btn-delete{

    background:#D32F2F;
    color:#fff;

}

.btn-print{

    background:#2E7D32;
    color:#fff;

}

.required{

    color:red;

}

.success-message{

    background:#E8F5E9;
    color:#2E7D32;
    border-left:5px solid #2E7D32;
    padding:15px;
    margin-bottom:20px;
    border-radius:6px;

}

.error-message{

    background:#FFEBEE;
    color:#C62828;
    border-left:5px solid #C62828;
    padding:15px;
    margin-bottom:20px;
    border-radius:6px;

}

.loading{

    opacity:.6;
    pointer-events:none;

}

@media(max-width:900px){

    .grid-2{

        grid-template-columns:1fr;

    }

    .grid-3{

        grid-template-columns:1fr;

    }

    .search-bar{

        flex-direction:column;
        align-items:stretch;

    }

    .action-bar{

        flex-direction:column;

    }

    #admissionTable{

        display:block;
        overflow-x:auto;

    }

}
