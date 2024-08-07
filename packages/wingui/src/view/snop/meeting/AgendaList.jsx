import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { makeStyles, createStyles } from '@mui/styles';
import { IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { EditableDiv } from './EditableDiv';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import deepEqual from 'fast-deep-equal/react';
import { Box, Button, Grid, Card,Typography } from '@mui/material';
import {useSnopMeetingStore} from './meetingStore'

const useStyles = makeStyles((theme) =>
  createStyles({
    item: {
        borderBottom:'1px solid #efefef',
        height:'42px',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    selected: {
        background: '#efefef'
    },
    seqNo: {
        paddingRight:'16px',
        fontSize:15
    },
    dragHandle: {
      cursor: 'grab',
      marginRight: '8px'
    }
  })
);

const cache = new CellMeasurerCache({
    defaultHeight: 45,
    fixedWidth: true
});

const AgendaList= React.forwardRef((props,ref)=> {

    const [addNewAgenda, 
          removeAgenda,
          setAgendaTitle,
          curAgendaList,
          setCurAgendaList,
          selAgenda,
          setSelAgenda] = useSnopMeetingStore(
            s => [
          s.addNewAgenda, s.removeAgenda, s.setAgendaTitle,
          s.curAgendaList,s.setCurAgendaList,s.selAgenda,s.setSelAgenda]
          );

    // const [redraw, setRedraw]= useState(0);

    // const storeState =useRef(snopMeetingStoreApi.getState())
    // const {addNewAgenda, 
    //   removeAgenda,
    //   setAgendaTitle,
    //   curAgendaList,
    //   setCurAgendaList,
    //   selAgenda,
    //   setSelAgenda}  = storeState.current;
    
    // function setSelectorChange(change) {
    //   const prevStat = storeState.current;
    //   if(prevStat.curAgendaList != change.curAgendaList ||
    //     prevStat.selAgenda != change.selAgenda) {
    //     storeState.current = change;
    //     setRedraw(generateId())
    //   }
    // }

    // useEffect(()=>{
    //   useSnopMeetingStore.subscribe(
    //     setSelectorChange,
    //     s => [      
    //       s.addNewAgenda, 
    //       s.removeAgenda, 
    //       s.setAgendaTitle,
    //       s.curAgendaList,
    //       s.setCurAgendaList,
    //       s.selAgenda,
    //       s.setSelAgenda
    //   ]);
    // },[])

    const classes = useStyles(props)
    const editRect = useRef(null)

    useEffect(() => {
        if(!selAgenda) {
            if(curAgendaList && curAgendaList.length > 0) {
              setSelAgenda(curAgendaList[0])
            }
        }
    }, [curAgendaList]);

    useImperativeHandle(ref, () => ({
      addNewAgenda,
      removeAgenda,
    }));

    const setEditRef=(ref)=>{
        if(ref && editRect.current != ref) {
            editRect.current = ref;
        }
    }
    
    /** agenda 선택 */
    const selectChange=(agnd)=> {
        setSelAgenda(agnd)
    }

    const editChange=(value, agnd)=> {
      setAgendaTitle(value);
    }

    // const handleKeyDown=(e, idx) => {
    //     console.log('handleKeyDown', idx)
    //     if(e.altKey) {
    //         if(e.keyCode == 13) {
    //             //next 이동
    //             if(curAgendaList.length > (idx+1)) {
    //                 selectChange(curAgendaList[idx +1])
    //             }
    //             else {
    //                 //새로생성
    //                 addNewAgenda();
    //             }
    //         }
    //     }      
    // }

    // const handleClick=(e, idx) => {
    //     selectChange(curAgendaList[idx])
    // }

    // const handleListKeyDown=(e)=>{
    //     if(selAgenda) {
    //         if(e.keyCode == 38) { //Arrow Up
    //             const idx = curAgendaList.findIndex(item=> item.id == selAgenda.id)
    //             if(idx > 0) {
    //                 selectChange(curAgendaList[idx - 1])
    //             }
    //         }
    //         else if(e.keyCode == 40) {//Arrow Down
    //             const idx = curAgendaList.findIndex(item=> item.id == selAgenda.id)
    //             if(idx < (curAgendaList.length-1)) {
    //                 selectChange(curAgendaList[idx + 1])
    //             }
    //         }
    //         else {
    //             // if(editRect.current)
    //             //     editRect.current.focus();
    //         }
    //     }
    // }

    function getStyle(provided, style) {
      if (!style) {
        return provided.draggableProps.style;
      }
    
      return {
        ...provided.draggableProps.style,
        ...style,
      };
    }

    function AgendaItem({isDragging,
                         isClone,
                         provided,
                         style, index,
                         agnd,
                         selItem}) {

      return (        
          <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                ...provided.draggableProps.style,
                backgroundColor: isDragging ? 'lightblue' : 'white',
              }}
              style={getStyle(provided, style)}
              className={[classes.item, selItem === agnd ? classes.selected : ''].join(' ')}
              isDragging={isDragging}
              onClick={(event) => selectChange(agnd)}
            >
              <span className={classes.seqNo}>{index + 1}.</span>
              <EditableDiv
                ref={setEditRef}
                value={agnd.agendaTitle}
                placeholder='Agenda'
                onChange={(value) => editChange(value, agnd)}
                disabled={selAgenda !== agnd}
                multiline={true}
                //onKeyDown={(e) => handleKeyDown(e, index)}
                //onClick={(e) => handleClick(e, index)}
              />
              <div>
                <div {...provided.dragHandleProps} style={styles.handle}>
                  &#x2630; {/* 핸들 아이콘 */}
                </div>
              </div>
          </Box>
      )
    }

    const rowRenderer = ({ index, key, parent, style }) => {
        const agnd = curAgendaList[index];

        return (
          <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  key={key}
                  parent={parent}
                  rowIndex={index}
                >
            <Draggable key={agnd.id} draggableId={`destination-${agnd.id}`} index={index} >
              {(provided, snapshot) => (

                  <AgendaItem
                      isDragging={snapshot.isDragging}
                      isClone={snapshot.isClone}
                      provided={provided}
                      style={style} 
                      index={index}
                      agnd={agnd}
                      selItem={selAgenda}
                  />
              )}
            </Draggable>
          </CellMeasurer>
        );
    };

    const onDragEnd = (result) => {
      if (!result.destination) return;

      const startIndex = result.source.index;
      const endIndex = result.destination.index;

      let newAgendaList = Array.from(curAgendaList);
      const [removed] = newAgendaList.splice(startIndex, 1);
      newAgendaList.splice(endIndex, 0, removed);

      newAgendaList.forEach(function (row,i) {
        if(row['seq'] != i){
          row['seq'] = i
          row._stat_='updated'
          }
      })

      setCurAgendaList(newAgendaList);
    };

    const styles = {
      handle: {
        // 핸들 스타일
        display: 'inline-block',
        marginRight: '8px',
        cursor: 'grab',
      },
    };
  
  

    return (
      <div style={{ width: '100%', height: '100%' }}
          // onKeyDown={handleListKeyDown}
      >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='agenda'
                   mode="virtual"
                   renderClone={(
                    provided,
                    snapshot,
                    rubric,
                   ) => (
                    <AgendaItem
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      agnd={curAgendaList[rubric.source.index]}
                      selItem={selAgenda}
                      style={{ margin: 0 }}
                      index={rubric.source.index}
                    />
                  )}
        >
          {(droppableProvided, snapshot) => (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    style={{ padding: '6px', border: '1px solid #efefef' }}
                    ref={(ref) => {
                      // react-virtualized has no way to get the list's ref that I can so
                      // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                      if (ref) {
                        // eslint-disable-next-line react/no-find-dom-node
                        const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                        if (whatHasMyLifeComeTo instanceof HTMLElement) {
                          droppableProvided.innerRef(whatHasMyLifeComeTo);
                        }
                      }
                    }}
                    height={height}
                    width={width}
                    overscanRowCount={0}
                    rowCount={curAgendaList.length}
                    rowHeight={cache.rowHeight}
                    rowRenderer={rowRenderer}
                    deferredMeasurementCache={cache}
                  />
                )}
              </AutoSizer>
          )}
        </Droppable>
      </DragDropContext>
      </div>
    );
})

export default AgendaList;  