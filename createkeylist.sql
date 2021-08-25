CREATE TABLE cdklist (
    num int PRIMARY KEY AUTO_INCREMENT,
    act boolean not null default false,
    cdk text not null,
    id bigint,
    actdate date
);
INSERT INTO cdklist(act,cdk) values(0,'HGNB-WT67-8NMJ');