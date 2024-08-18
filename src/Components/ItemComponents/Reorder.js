import { Fragment, memo, useEffect, useLayoutEffect, useState, useRef } from "react";
import styles from "./AddNew.module.css";
import { getOrderedData, updateOrder } from "../../Firebase-utils/CallingMethods";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SlideoutHeader } from './SlideoutHeader';
import { ActionsFooter } from './ActionsFooter';
import ReOrderItem from "./ReorderItem";

const Reorder = memo(({ onClose, docName, title }) => {
    useEffect(() => {
        const scrollAnimElements = document.querySelectorAll(
            "[data-animate-on-scroll]"
        );
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting || entry.intersectionRatio > 0) {
                        const targetElement = entry.target;
                        targetElement.classList.add(styles.animate);
                        observer.unobserve(targetElement);
                    }
                }
            },
            {
                threshold: 0.15,
            }
        );

        for (let i = 0; i < scrollAnimElements.length; i++) {
            observer.observe(scrollAnimElements[i]);
        }

        return () => {
            for (let i = 0; i < scrollAnimElements.length; i++) {
                observer.unobserve(scrollAnimElements[i]);
            }
        };
    }, []);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set up the onQuerySnapshot listener
        const unsubscribe = getOrderedData(docName, setData, "contents", setLoading)
        // Cleanup listener
        return () => unsubscribe();
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return; // Dragged outside the list
        }

        const reorderedItems = Array.from(data);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        // Handle reorder logic (e.g., update state, send to server, etc.)
        setData(reorderedItems)
    };
    const updatOrder = () => {
        const updatedOrder = data.map((item, index) => ({
            slug: docName === "My Writings" ? item.referenceTitle : docName === "UX case studies" ? item.slug : docName === "Faq's" ? item.question : item.category,
            order: index, // Now starting from 0
        }));
        updateOrder(updatedOrder, docName);
        onClose();
    }
    return <div className={styles.addNewCaseStudiesSlideOut} data-animate-on-scroll>
        <SlideoutHeader onClose={onClose} type={title} isOrder={true} />
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={styles.mainForm}>
                        <div className={styles.mainFormContent}>
                            {data.length > 0 && data.map((item, index) => (
                                <Draggable key={item.order} draggableId={item.order.toString()} index={index}>
                                    {(provided) => (
                                        <ReOrderItem
                                            r={provided.innerRef}
                                            p={provided}

                                            title={item.referenceTitle}
                                            order={index}
                                        />


                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
        <ActionsFooter onClose={onClose} action={updatOrder} />
    </div>
})

export default Reorder;