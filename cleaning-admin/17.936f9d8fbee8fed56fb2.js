(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"E+PN":function(e,t,a){"use strict";a.r(t);var c=a("DUip"),i=a("nbAZ"),r=a("Byqp"),n=a("ETwC"),s=a("ea4N"),l=a("AytR"),o=a("MVX8"),u=a("y5gy"),d=a("oYWW"),b=a("TYT/"),p=a("6onV"),m=a("eHTH"),f=a("cSbt"),v=a("QJY3"),h=a("GsDI"),Z=a("p+mS"),g=a("Valr");function H(e,t){1&e&&(b.ac(0,"th",33),b.Hc(1," Title "),b.Zb())}function q(e,t){if(1&e&&(b.ac(0,"td",34),b.Hc(1),b.Zb()),2&e){var a=t.$implicit;b.Hb(1),b.Ic(null==a?null:a.title)}}function D(e,t){1&e&&(b.ac(0,"th",33),b.Hc(1," Service "),b.Zb())}function S(e,t){if(1&e&&(b.ac(0,"td",34),b.Hc(1),b.Zb()),2&e){var a=t.$implicit;b.Hb(1),b.Ic(null==a?null:a.service)}}function w(e,t){1&e&&(b.ac(0,"th",33),b.Hc(1," Service Area "),b.Zb())}function y(e,t){if(1&e&&(b.ac(0,"td",34),b.Hc(1),b.Zb()),2&e){var a=t.$implicit;b.Hb(1),b.Jc(" ",null==a?null:a.serviceArea," ")}}function I(e,t){1&e&&(b.ac(0,"th",33),b.Hc(1," Location "),b.Zb())}function C(e,t){if(1&e&&(b.ac(0,"td",34),b.Hc(1),b.Zb()),2&e){var a=t.$implicit;b.Hb(1),b.Ic(null==a?null:a.location)}}function R(e,t){1&e&&(b.ac(0,"th",33),b.Hc(1," Created At "),b.Zb())}function k(e,t){if(1&e&&(b.ac(0,"td",35),b.Hc(1),b.nc(2,"date"),b.Zb()),2&e){var a=t.$implicit;b.Hb(1),b.Jc(" ",b.pc(2,1,null==a?null:a.createdAt,"medium")," ")}}function O(e,t){1&e&&(b.ac(0,"th",36),b.Hc(1," Actions "),b.Zb())}function A(e,t){if(1&e){var a=b.bc();b.ac(0,"td",37),b.ac(1,"div",38),b.ac(2,"button",39),b.ic("click",(function(){b.zc(a);var e=t.$implicit;return b.mc().onView(null==e?null:e._id)})),b.ac(3,"span",40),b.ac(4,"i",7),b.Hc(5,"visibility"),b.Zb(),b.Zb(),b.Vb(6,"div",41),b.Vb(7,"div",42),b.Zb(),b.ac(8,"button",43),b.ic("click",(function(){b.zc(a);var e=t.$implicit;return b.mc().onDelete(null==e?null:e._id,null==e?null:e.title)})),b.ac(9,"span",40),b.ac(10,"i",7),b.Hc(11,"delete"),b.Zb(),b.Zb(),b.Vb(12,"div",41),b.Vb(13,"div",42),b.Zb(),b.Zb(),b.Zb()}}function P(e,t){1&e&&b.Vb(0,"tr",44)}function G(e,t){1&e&&b.Vb(0,"tr",45)}var z=function(){function e(e,t,a,c){var i=this;this.router=e,this.store=t,this.route=a,this.dialog=c,this.displayedColumns=["title","service","serviceArea","location","createdAt","actions"],this.pageSizeOptions=[15,25,50],this.serviceRequests=[],this.onView=function(e){i.router.navigate(["service-request","view",e])},this.onDelete=function(e,t){i.openDialog(e,t)},this.openDialog=function(e,t){var a=new s.d;a.disableClose=!0,a.autoFocus=!0,a.data={id:e,title:t,type:"Service Request"},i.dialog.open(u.a,a).afterClosed().subscribe((function(t){if(t){var a={id:e};i.store.dispatch(Object(d.e)({id:a.id}))}}))},this.onToggleActiveAction=function(e,t){var a={_id:e,active:!t};i.store.dispatch(Object(d.k)({request:a,id:e}))},this.applySearch=function(){i.searchValue&&(i.searchKeyword=i.searchValue,i.dataSource.filter=i.searchKeyword.trim().toLowerCase(),i.dataSource.paginator&&i.dataSource.paginator.firstPage(),i.changeRequestParams())},this.onResetFilters=function(){i.searchValue=void 0,i.searchKeyword=void 0,i.dataSource.filter="",i.dataSource.paginator.firstPage(),i.dataSource.sort.sort({id:null,start:"desc",disableClear:!1}),i.router.navigate(["service-request"])},this.sortData=function(e){return i.sortField=e.active,i.sortOrder=e.direction,i.changeRequestParams(),e},this.onPageChange=function(e){return i.pageIndex=e.pageIndex,i.pageSize=e.pageSize,i.changeRequestParams(),e},this.changeRequestParams=function(){i.router.navigate(["service-request"],{queryParams:{page:i.pageIndex,size:i.pageSize,sort:i.sortField,by:i.sortOrder,search:i.searchKeyword}})},this.ngOnDestroy=function(){i.serviceRequestSubscription&&i.serviceRequestSubscription.unsubscribe(),i.loadingSubscription&&i.loadingSubscription.unsubscribe()},this.dataSource=new n.k(this.serviceRequests)}return e.prototype.ngOnInit=function(){var e=this;this.imgUrl=l.a.imgUrl,this.loadingSubscription=this.store.select(o.b).subscribe((function(t){e.loading=t})),this.route.queryParamMap.subscribe((function(t){var a,c=t.params;c.hasOwnProperty("page")&&(e.pageIndex=c.page,e.paginator.pageIndex=e.pageIndex),c.hasOwnProperty("size")&&(e.pageSize=c.size,e.paginator.pageSize=e.pageSize),c.hasOwnProperty("search")&&(e.searchKeyword=c.search,e.searchValue=c.search),c.hasOwnProperty("sort")&&(e.sortField=c.sort,e.sortOrder=null===(a=c)||void 0===a?void 0:a.by,e.sort.active=e.sortField,e.sort.direction=e.sortOrder)})),this.serviceRequestSubscription=this.store.select(o.c).subscribe((function(t){e.serviceRequests=t;var a=e.serviceRequests.map((function(e){var t;return Object.assign({service:null===(t=e.serviceType)||void 0===t?void 0:t.service},e)}));e.dataSource=new n.k(a),e.searchKeyword?(e.dataSource.filter=e.searchKeyword.trim().toLowerCase(),e.dataSource.paginator=e.paginator,e.dataSource.sort=e.sort):(e.dataSource.paginator=e.paginator,e.dataSource.sort=e.sort)}))},e.\u0275fac=function(t){return new(t||e)(b.Ub(c.f),b.Ub(p.h),b.Ub(c.a),b.Ub(s.b))},e.\u0275cmp=b.Ob({type:e,selectors:[["app-service-request-list"]],viewQuery:function(e,t){var a;1&e&&(b.Ec(i.a,!0),b.Ec(r.a,!0)),2&e&&(b.wc(a=b.jc())&&(t.paginator=a.first),b.wc(a=b.jc())&&(t.sort=a.first))},decls:47,vars:5,consts:[[1,"main-content","main-panel-new"],[1,"container-fluid"],[1,"row"],[1,"col-md-12"],[1,"card"],[1,"card-header","card-header-info","card-header-icon"],[1,"card-icon"],[1,"material-icons"],[1,"card-title"],[1,"card-body"],[1,"col-md-3","search_box"],[1,"example-full-width"],["matInput","","placeholder","Search...","name","searchValue",3,"ngModel","keyup.enter","ngModelChange"],[1,"col-md-6","search_button_box"],["type","button","title","Search",1,"btn","btn-outline-primary","search_button_button",3,"click"],["type","button","title","Reset",1,"btn","btn-outline-danger","search_button_button",3,"click"],[1,"table-responsive"],[1,"mat-elevation-z8"],["mat-table","","matSort","",2,"width","100%",3,"dataSource","matSortChange"],["matColumnDef","title"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","service"],["matColumnDef","serviceArea"],["matColumnDef","location"],["matColumnDef","createdAt"],["mat-cell","","style","min-width: 170px;",4,"matCellDef"],["matColumnDef","actions"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","","class","td-actions",4,"matCellDef"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],[3,"pageSizeOptions","page"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-cell","",2,"min-width","170px"],["mat-header-cell",""],["mat-cell","",1,"td-actions"],[1,"action-col"],["mat-raised-button","","type","button",1,"btn","btn-success","btn-link",3,"click"],[1,"mat-button-wrapper"],["matripple","",1,"mat-button-ripple","mat-ripple"],[1,"mat-button-focus-overlay"],["mat-raised-button","","type","button",1,"btn","btn-danger","btn-link",3,"click"],["mat-header-row",""],["mat-row",""]],template:function(e,t){1&e&&(b.ac(0,"div",0),b.ac(1,"div",1),b.ac(2,"div",2),b.ac(3,"div",3),b.ac(4,"div",4),b.ac(5,"div",5),b.ac(6,"div",6),b.ac(7,"i",7),b.Hc(8,"directions_bus"),b.Zb(),b.Zb(),b.ac(9,"h4",8),b.Hc(10," Service Requests "),b.Zb(),b.Zb(),b.ac(11,"div",9),b.ac(12,"div",2),b.ac(13,"div",10),b.ac(14,"mat-form-field",11),b.ac(15,"input",12),b.ic("keyup.enter",(function(){return t.applySearch()}))("ngModelChange",(function(e){return t.searchValue=e})),b.Zb(),b.Zb(),b.Zb(),b.ac(16,"div",13),b.ac(17,"button",14),b.ic("click",(function(){return t.applySearch()})),b.ac(18,"mat-icon"),b.Hc(19,"search"),b.Zb(),b.Zb(),b.ac(20,"button",15),b.ic("click",(function(){return t.onResetFilters()})),b.ac(21,"mat-icon"),b.Hc(22,"replay"),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.ac(23,"div",16),b.ac(24,"div",17),b.ac(25,"table",18),b.ic("matSortChange",(function(e){return t.sortData(e)})),b.Yb(26,19),b.Gc(27,H,2,0,"th",20),b.Gc(28,q,2,1,"td",21),b.Xb(),b.Yb(29,22),b.Gc(30,D,2,0,"th",20),b.Gc(31,S,2,1,"td",21),b.Xb(),b.Yb(32,23),b.Gc(33,w,2,0,"th",20),b.Gc(34,y,2,1,"td",21),b.Xb(),b.Yb(35,24),b.Gc(36,I,2,0,"th",20),b.Gc(37,C,2,1,"td",21),b.Xb(),b.Yb(38,25),b.Gc(39,R,2,0,"th",20),b.Gc(40,k,3,4,"td",26),b.Xb(),b.Yb(41,27),b.Gc(42,O,2,0,"th",28),b.Gc(43,A,14,0,"td",29),b.Xb(),b.Gc(44,P,1,0,"tr",30),b.Gc(45,G,1,0,"tr",31),b.Zb(),b.ac(46,"mat-paginator",32),b.ic("page",(function(e){return t.pageEvent=t.onPageChange(e)})),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb()),2&e&&(b.Hb(15),b.sc("ngModel",t.searchValue),b.Hb(10),b.sc("dataSource",t.dataSource),b.Hb(19),b.sc("matHeaderRowDef",t.displayedColumns),b.Hb(1),b.sc("matRowDefColumns",t.displayedColumns),b.Hb(1),b.sc("pageSizeOptions",t.pageSizeOptions))},directives:[m.b,f.a,v.b,v.k,v.n,h.a,n.j,r.a,n.c,n.e,n.b,n.g,n.i,i.a,n.d,r.b,n.a,Z.a,n.f,n.h],pipes:[g.e],styles:[""]}),e}(),V=a("Ynzz"),_=function(){function e(){}return e.prototype.transform=function(e){switch(e.toString()){case"-1":return"Cancelled";case"0":return"Pending";case"1":return"Accepted";case"2":return"Work in progress";case"3":return"Completed";default:return"Pending"}},e.\u0275fac=function(t){return new(t||e)},e.\u0275pipe=b.Tb({name:"requestStatus",type:e,pure:!0}),e}();function x(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Accepted By"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.nc(5,"titlecase"),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(b.oc(5,1,(null==a.requestDetails?null:a.requestDetails.acceptedBy.firstname)+" "+(null==a.requestDetails?null:a.requestDetails.acceptedBy.lastname)))}}function T(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Accepted Time"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.nc(5,"date"),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(b.pc(5,1,null==a.requestDetails?null:a.requestDetails.acceptedAt,"medium"))}}function M(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Work Started At"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.nc(5,"date"),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(b.pc(5,1,null==a.requestDetails?null:a.requestDetails.workStartedAt,"medium"))}}function j(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Work Completed At"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.nc(5,"date"),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(b.pc(5,1,null==a.requestDetails?null:a.requestDetails.workCompletedAt,"medium"))}}function U(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Rating"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(null==a.requestDetails?null:a.requestDetails.review.rating)}}function Y(e,t){if(1&e&&(b.ac(0,"tr"),b.ac(1,"td",14),b.Hc(2,"Customer Review"),b.Zb(),b.ac(3,"td"),b.Hc(4),b.Zb(),b.Zb()),2&e){var a=b.mc();b.Hb(4),b.Ic(null==a.requestDetails?null:a.requestDetails.review.reviewText)}}var F=function(){function e(e,t,a){var c=this;this.route=e,this.router=t,this.store=a,this.loading=!1,this.ngOnDestroy=function(){c.serviceRequestSubscription&&c.serviceRequestSubscription.unsubscribe(),c.loadingSubscription&&c.loadingSubscription.unsubscribe()}}return e.prototype.ngOnInit=function(){var e=this;this.loadingSubscription=this.store.pipe(Object(p.t)(o.b)).subscribe((function(t){e.loading=t})),this.route.paramMap.subscribe((function(t){t.has("id")?(e.requestId=t.get("id"),e.serviceRequestSubscription=e.store.pipe(Object(p.t)(Object(o.d)(e.requestId))).subscribe((function(t){t?e.requestDetails=t:e.router.navigate(["service-request"])}))):e.router.navigate(["service-request"])}))},e.\u0275fac=function(t){return new(t||e)(b.Ub(c.a),b.Ub(c.f),b.Ub(p.h))},e.\u0275cmp=b.Ob({type:e,selectors:[["app-service-request-create"]],decls:83,vars:28,consts:[[1,"main-content","main-panel-new"],[1,"container-fluid"],[1,"row"],[1,"col-md-12"],[1,"card"],[1,"card-header","card-header-info","card-header-icon"],[1,"card-icon"],[1,"material-icons"],[1,"card-title"],[1,"card-body"],[1,"modal-content"],[1,"modal-body"],[1,"table-responsive"],[1,"table"],[1,"font-weight-bold"],[3,"routerLink"],[4,"ngIf"]],template:function(e,t){1&e&&(b.ac(0,"div",0),b.ac(1,"div",1),b.ac(2,"div",2),b.ac(3,"div",3),b.ac(4,"div",4),b.ac(5,"div",5),b.ac(6,"div",6),b.ac(7,"i",7),b.Hc(8,"directions_bus"),b.Zb(),b.Zb(),b.ac(9,"h4",8),b.Hc(10,"Service Request"),b.Zb(),b.Zb(),b.ac(11,"div",9),b.ac(12,"div",10),b.ac(13,"div",11),b.ac(14,"div",12),b.ac(15,"table",13),b.ac(16,"tbody"),b.ac(17,"tr"),b.ac(18,"td",14),b.Hc(19,"Service Name"),b.Zb(),b.ac(20,"td"),b.Hc(21),b.Zb(),b.Zb(),b.ac(22,"tr"),b.ac(23,"td",14),b.Hc(24,"Service Info"),b.Zb(),b.ac(25,"td"),b.Hc(26),b.Zb(),b.Zb(),b.ac(27,"tr"),b.ac(28,"td",14),b.Hc(29,"Customer Name"),b.Zb(),b.ac(30,"td"),b.ac(31,"a",15),b.Hc(32),b.nc(33,"titlecase"),b.Zb(),b.Zb(),b.Zb(),b.ac(34,"tr"),b.ac(35,"td",14),b.Hc(36,"Contact Number"),b.Zb(),b.ac(37,"td"),b.Hc(38),b.Zb(),b.Zb(),b.ac(39,"tr"),b.ac(40,"td",14),b.Hc(41,"Location"),b.Zb(),b.ac(42,"td"),b.Hc(43),b.Zb(),b.Zb(),b.ac(44,"tr"),b.ac(45,"td",14),b.Hc(46,"Service Area"),b.Zb(),b.ac(47,"td"),b.Hc(48),b.Zb(),b.Zb(),b.ac(49,"tr"),b.ac(50,"td",14),b.Hc(51,"Service Type"),b.Zb(),b.ac(52,"td"),b.Hc(53),b.Zb(),b.Zb(),b.ac(54,"tr"),b.ac(55,"td",14),b.Hc(56,"Service Plan"),b.Zb(),b.ac(57,"td"),b.Hc(58),b.Zb(),b.Zb(),b.ac(59,"tr"),b.ac(60,"td",14),b.Hc(61,"Date Of Service"),b.Zb(),b.ac(62,"td"),b.Hc(63),b.nc(64,"date"),b.Zb(),b.Zb(),b.ac(65,"tr"),b.ac(66,"td",14),b.Hc(67,"Time Of Service"),b.Zb(),b.ac(68,"td"),b.Hc(69),b.nc(70,"date"),b.Zb(),b.Zb(),b.Gc(71,x,6,3,"tr",16),b.Gc(72,T,6,4,"tr",16),b.Gc(73,M,6,4,"tr",16),b.Gc(74,j,6,4,"tr",16),b.Gc(75,U,5,1,"tr",16),b.Gc(76,Y,5,1,"tr",16),b.ac(77,"tr"),b.ac(78,"td",14),b.Hc(79,"Status"),b.Zb(),b.ac(80,"td"),b.Hc(81),b.nc(82,"requestStatus"),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb(),b.Zb()),2&e&&(b.Hb(21),b.Ic(null==t.requestDetails?null:t.requestDetails.title),b.Hb(5),b.Ic(null==t.requestDetails?null:t.requestDetails.body),b.Hb(5),b.sc("routerLink","/customer/view/"+(null==t.requestDetails?null:t.requestDetails.customerId._id)),b.Hb(1),b.Ic(b.oc(33,18,(null==t.requestDetails?null:null==t.requestDetails.customerId?null:t.requestDetails.customerId.firstname)+" "+(null==t.requestDetails?null:null==t.requestDetails.customerId?null:t.requestDetails.customerId.lastname))),b.Hb(6),b.Ic(null==t.requestDetails?null:t.requestDetails.contact),b.Hb(5),b.Ic(null==t.requestDetails?null:t.requestDetails.location),b.Hb(5),b.Ic(null==t.requestDetails?null:t.requestDetails.serviceArea),b.Hb(5),b.Ic(null==t.requestDetails?null:t.requestDetails.serviceType.service),b.Hb(5),b.Ic(null==t.requestDetails?null:null==t.requestDetails.servicePackage?null:t.requestDetails.servicePackage.name),b.Hb(5),b.Ic(b.pc(64,20,null==t.requestDetails?null:t.requestDetails.dateOfService,"MMM dd, yyyy")),b.Hb(6),b.Ic(b.pc(70,23,null==t.requestDetails?null:t.requestDetails.timeOfService,"HH:mm a")),b.Hb(2),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.acceptedBy),b.Hb(1),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.acceptedAt),b.Hb(1),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.workStartedAt),b.Hb(1),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.workCompletedAt),b.Hb(1),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.review),b.Hb(1),b.sc("ngIf",null==t.requestDetails?null:t.requestDetails.review),b.Hb(5),b.Ic(b.oc(82,26,null==t.requestDetails?null:t.requestDetails.workStatus)))},directives:[c.h,g.l],pipes:[g.r,g.e,_],styles:["td.font-weight-bold[_ngcontent-%COMP%]{width:30%!important}.modal-content[_ngcontent-%COMP%]{box-shadow:none;margin-top:20px}"]}),e}(),K=a("/bIl"),X=a("orwC"),$=[{path:"",component:z,resolve:{serviceRequest:V.a}},{path:"create",component:F},{path:"view/:id",component:F,resolve:{cleaner:K.a,customer:X.a}},{path:"edit/:id",component:F}],J=function(){function e(){}return e.\u0275mod=b.Sb({type:e}),e.\u0275inj=b.Rb({factory:function(t){return new(t||e)},imports:[[c.i.forChild($)],c.i]}),e}(),L=a("8T6J");a.d(t,"ServiceRequestModule",(function(){return B}));var B=function(){function e(){}return e.\u0275mod=b.Sb({type:e}),e.\u0275inj=b.Rb({factory:function(t){return new(t||e)},imports:[[L.a,J]]}),e}()}}]);