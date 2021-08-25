CREATE TABLE cdklist (
    num int PRIMARY KEY AUTO_INCREMENT,
    act boolean not null default false,
    cdk text not null,
    id bigint,
    actdate date
);
INSERT INTO cdklist(act,cdk) values(0,'HGNB-WT67-8NMJ'),(0,'98C4-T67Q-N8GJ'),(0,'W79N-8WYG-BRCJ'),(0,'TH32-245H-J3NJ'),(0,'LY7A-F9SU-2BVJ'),(0,'7Q9T-6V59-QB8J');
INSERT INTO cdklist(act,cdk) values(0,'WN89-NRCY-723Z'),(0,'CN29-7R9C-R29Z'),(0,'MXNN-CYF7-W8CZ'),(0,'CXN2-8TVB-29AZ'),(0,'QTCB-NQDT-7BFZ')