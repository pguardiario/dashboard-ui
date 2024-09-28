import React, { useState } from 'react';
import styled from '@xstyled/styled-components';
import { borderRadius, grid } from './constants';
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@nextui-org/react";
import { format } from 'timeago.js';
import KanbanCard from "@/components/common/KanbanCard"


const getBackgroundColor = (isDragging, isGroupedOver, authorColors) => {
  if (isDragging) {
    return '#EBECF0';
  }

  if (isGroupedOver) {
    return '#EBECF0';
  }

  return '#FFFFFF';
};

const getBorderColor = (isDragging, authorColors) =>
  isDragging ? 'blue' : 'transparent';

const imageSize = 40;

const CloneBadge = styled.div`
  background: #79f2c0;
  bottom: ${grid / 2}px;
  border: 2px solid #57d9a3;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props) => getBorderColor(props.isDragging, props.colors)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px #A5ADBA` : 'none')};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: #091e42;

  &:hover,
  &:active {
    color: #091e42;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

// const Avatar = styled.img`
//   width: ${imageSize}px;
//   height: ${imageSize}px;
//   border-radius: 50%;
//   margin-right: ${grid}px;
//   flex-shrink: 0;
//   flex-grow: 0;
// `;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Author = styled.small`
  flex-grow: 0;
  margin: 0;
  border-radius: ${borderRadius}px;
  font-weight: normal;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent

function QuoteItem(props) {
  const { quote, isDragging, isGroupedOver, provided, style, isClone, index } = props;
  const [card, setCard] = useState(0)

  // return <div className="bg-red-400">{quote.id}</div>

  return <>
    {card > 0 && <KanbanCard/>}
    <div
      // href={quote.author.url}
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      // isClone={isClone}
      // colors={quote.author.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={quote.id}
      data-index={index}
      aria-label={`${quote.name}`}
      onClick={(e) => {
        e.stopPropagation()
        setCard(card + 1)
      }}
      className={`${quote.status === "finished" ? "bg-green-200 border-green-600" : "bg-blue-200 border-blue-600"} border p-2 my-2 rounded`}
    >

      {isClone ? <CloneBadge>Clone</CloneBadge> : null}
      <div className="w-full ">
      <div className="justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{quote.name}</h4>
            <h5 className="text-small tracking-tight text-default-400">{format(quote.time, 'en_US')}</h5>
          </div>
        </div>
      </div>
      <div className="px-0 py-2 text-small text-default-400">
        <p>
          {quote.description}
        </p>
      </div>
    </div>
    </div>
    </>
}

export default React.memo(QuoteItem);
