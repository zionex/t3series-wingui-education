import { create, createStore } from 'zustand';
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import produce from 'immer';
import { deepClone } from '@zionex/wingui-core';
import React,{useState, useRef ,useEffect} from 'react';
import deepEqual from 'fast-deep-equal/react';
import { useShallow } from 'zustand/react/shallow'

const log = config => (set, get, api) => config(args => {
    console.log("  applying", args)
    set(args)
    console.log("  new state", get())
}, get, api)

const immer = config => (set, get, api) => config((partial, replace) => {
    const nextState = typeof partial === 'function'
      ? produce(partial)
      : partial
    return set(nextState, replace)
  }, get, api)

let SnopMeetingStore = (set, get, api) => ({
    initStore:()=>_initStore(get(),set),
    orgMeetingData: null,
    setOrgMeetingData: (val) => _setOrgMeetingData(get(),set, val),
    curMeetingData: null,
    getEditingMeetingData: ()=> get().curMeetingData,
    minutes:'',
    setMinutes: (val) => _setMinutes(get(), set, val),
    curAttendeeList:[], 
    setCurAttendeeList: (val) => _setCurAttendeeList(get(),set, val),
    curAgendaList:[], 
    setCurAgendaList: (val) => _setCurAgendaList(get(),set,val),
    curMenuList:[], 
    setCurMenuList: (val) => _setCurMenuList(get(),set,val),
    curFileList:[], 
    setCurFileList: (val) => _setCurFileList(get(),set,val),
    selAgenda:null, 
    setSelAgenda: (val) => { set({ selAgenda: val }) },
    isMeetingUpdated:()=> _isMeetingUpdated(get()),
    setAgendaDetail:(val)=>_setAgendaDetail(get(),set,val),
    addNewAgenda:()=>_addNewAgenda(get(),set),
    removeAgenda:()=>_removeAgenda(get(),set),
    setAgendaTitle:(val) => _setAgendaTitle(get(),set,val),
    getAgendaCnt: ()=> get().curAgendaList?.length,
    removeMenu:(val) => _removeMenu(get(),set, val),
    getCurrentAgendaId:()=> _getCurrentAgendaId(get()),
  })

  SnopMeetingStore = subscribeWithSelector(SnopMeetingStore)
  //SnopMeetingStore = devtools(SnopMeetingStore) //devtools
  SnopMeetingStore = immer(SnopMeetingStore) //immer
  //SnopMeetingStore = log(SnopMeetingStore) //log
  
  
export const snopMeetingStore = create(SnopMeetingStore)
//export const useSnopMeetingStore = snopMeetingStore

/** react 에서 selector만 subscribe되도록 */
export function useSnopMeetingStore(selector) {
    return snopMeetingStore(useShallow(selector))
}


function _initStore(state, set) {
    set({ 
        orgMeetingData: null, 
        curMeetingData:null, 
        curAttendeeList:[],
        curAgendaList:[],
        curMenuList:[],
        curFileList:[],
        selAgenda:null,
        minutes:''
        }
    ); 
}

function _setOrgMeetingData(state, set, val) {
    let curMeetingData = deepClone(val);
    
    set({ orgMeetingData: val, curMeetingData:curMeetingData,
        curAttendeeList: curMeetingData.attendee,
        curAgendaList: curMeetingData.agenda,
        curMenuList:curMeetingData.menu,
        curFileList:curMeetingData.files,
        selAgenda: curMeetingData.agenda && curMeetingData.agenda.length> 0 ? curMeetingData.agenda[0] : null,
        minutes: curMeetingData.minutes 
    })
}

function _setMinutes(state, set, val) {
    let curMeetingData= state.curMeetingData;
    if(!curMeetingData)
        return;

    curMeetingData.minutes = val;
    set({minutes:val,curMeetingData:curMeetingData})
}

function _setCurAttendeeList(state, set, val) {
    let curMeetingData= state.curMeetingData;
    if(!curMeetingData)
        return;
    curMeetingData.attendee = val;

    set({ curAttendeeList: val, curMeetingData:curMeetingData })
}

function _setCurAgendaList(state, set, val) {
    let curMeetingData= state.curMeetingData;
    if(!curMeetingData)
        return;
    curMeetingData.agenda = val;

    set({ curAgendaList: val, curMeetingData:curMeetingData })
}

function _setCurMenuList(state, set, val) {
    let curMeetingData= state.curMeetingData;
    if(!curMeetingData)
        return;
    curMeetingData.menu = val;

    set({ curMenuList: val, curMeetingData:curMeetingData })
}

function _setCurFileList(state, set, val) {
    let curMeetingData= state.curMeetingData;
    if(!curMeetingData)
        return;
    curMeetingData.files = val;

    set({ curFileList: val, curMeetingData:curMeetingData })
}

function _isMeetingUpdated(state) {
    const orgMeetingData=state.orgMeetingData;
    const curMeetingData= state.curMeetingData;

    if(!orgMeetingData || !curMeetingData)
        return false;

    const isEqual = deepEqual(orgMeetingData, curMeetingData);
    return !isEqual;
}

function _setAgendaDetail(state, set, val) {
    const curAgendaList = state.curAgendaList;
    const selAgenda = state.selAgenda;
    if(selAgenda) {

        let thisAgenda= curAgendaList.find(a=> a.id == selAgenda.id)
        if(thisAgenda) {
            thisAgenda['agendaContents'] = val;
            if(thisAgenda['_stat_'] != 'created')
                thisAgenda['_stat_'] = 'updated'
        }
    }
}

function _setAgendaTitle(state, set, val) {
    const curAgendaList = state.curAgendaList;
    const selAgenda = state.selAgenda;
    if(selAgenda) {

        let thisAgenda= curAgendaList.find(a=> a.id == selAgenda.id)
        if(thisAgenda) {
            thisAgenda['agendaTitle'] = val;
            if(thisAgenda['_stat_'] != 'created')
                thisAgenda['_stat_'] = 'updated'
        }
    }
}

function _addNewAgenda(state, set) {
    let curMeetingData = state.curMeetingData;
    if(!curMeetingData)
        return;
    const curAgendaList= state.curAgendaList;

    let length = curAgendaList.length;
    const newAgenda={ meetId :curMeetingData.id , id : generateId(), _stat_:'created', seq: length+1 }

    const newAgendaList = [ ...curAgendaList, newAgenda];
    curMeetingData.agenda = newAgendaList;
    set({curAgendaList: newAgendaList,curMeetingData:curMeetingData})
}

    
/** 현재 선택된 agenda를 목록에서 삭제 */
function _removeAgenda(state, set) {
    let curMeetingData = state.curMeetingData;
    const selAgenda    = state.selAgenda;
    if(!curMeetingData || !selAgenda)
        return;

    const curAgendaList = state.curAgendaList;
    const newAgendaList = curAgendaList.filter(item=> item.id != selAgenda.id);
    curMeetingData.agenda = newAgendaList;
    set({curAgendaList: newAgendaList,curMeetingData:curMeetingData, selAgenda:null})
}

/* 선택한 화면을 목록에서 삭제 */
function _removeMenu(state, set, menuItem) {
    let curMeetingData = state.curMeetingData;
    const selAgenda    = state.selAgenda;
    if(!curMeetingData || !selAgenda)
        return;

    const curMenuList = state.curMenuList;
    const newMenuList = curMenuList.filter(item=> item.id != menuItem.id)
    curMeetingData.menu = newMenuList;
    set({curMenuList:newMenuList, curMeetingData:curMeetingData})
}

function _getCurrentAgendaId(state) {
    if(state.selAgenda) {
      return state.selAgenda.id
    }
    else
      return null;
}