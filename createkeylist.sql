CREATE TABLE cdklist (
    num int PRIMARY KEY AUTO_INCREMENT,
    act boolean not null default false,
    cdk text not null,
    id bigint default null,
    actdate date default null,
);
INSERT INTO cdklist(cdk) values('AFIY-278E-GF6P'),('2IUY-RGFY-ARWP'),('8UW9-Y78R-DCJP'),('47W9-EHRT-ASRP'),('9OSY-FGAS-DFGP'),('SD89-QCF4-S7FP'),('XY18-SRGO-EHUP'),('0XZB-HDF8-9EJP');
create table usrlib(
id bigint not null primary key,
r6id tinytext not null,
sel tinyint not null
);