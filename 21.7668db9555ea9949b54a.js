(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{dOL9:function(t,e,c){"use strict";c.r(e),c.d(e,"DeactivateAccountModule",(function(){return l}));var n=c("ofXK"),o=c("tyNb"),i=c("MXcw"),a=c("PSD3"),r=c.n(a),s=c("fXoL"),u=c("kt0X");const d=[{path:"",component:(()=>{class t{constructor(t){this.store=t,this.onDeactivateProfile=()=>{r.a.fire({title:"Deactivate Account",text:"Are you sure you want to deactivate you account?",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes",cancelButtonText:"No"}).then(t=>{t.value&&this.store.dispatch(Object(i.c)({data:{profile_status:-1}}))})}}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)(s.Zb(u.h))},t.\u0275cmp=s.Tb({type:t,selectors:[["app-deactivate-account"]],decls:12,vars:0,consts:[["id","deactivate-v",1,"tab-pane","active"],[1,"proHead"],[1,"profileDes"],[1,"proDetails",2,"width","100%"],[1,"row"],[1,"col-md-12"],["type","button",1,"btn","btn-info","custombtn","blueBtn",3,"click"]],template:function(t,e){1&t&&(s.ec(0,"div",0),s.ec(1,"div",1),s.ec(2,"h2"),s.Yc(3,"Delete your account"),s.dc(),s.dc(),s.ec(4,"div",2),s.ec(5,"div",3),s.ec(6,"div",4),s.ec(7,"div",5),s.ec(8,"p"),s.Yc(9," Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "),s.dc(),s.ec(10,"button",6),s.pc("click",(function(){return e.onDeactivateProfile()})),s.Yc(11," Deactivate "),s.dc(),s.dc(),s.dc(),s.dc(),s.dc(),s.dc())},styles:[""]}),t})()}];let p=(()=>{class t{}return t.\u0275mod=s.Xb({type:t}),t.\u0275inj=s.Wb({factory:function(e){return new(e||t)},imports:[[o.j.forChild(d)],o.j]}),t})(),l=(()=>{class t{}return t.\u0275mod=s.Xb({type:t}),t.\u0275inj=s.Wb({factory:function(e){return new(e||t)},imports:[[n.c,p]]}),t})()}}]);