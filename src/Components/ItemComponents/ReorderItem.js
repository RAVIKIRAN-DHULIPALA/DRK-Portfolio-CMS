import { memo } from "react";
import styles from "./ReOrderItem.module.css";

const ReOrderItem = memo(({ title, order, r, p }) => {
    return (
        <div className={styles.reOrderItem} ref={r} {...p.draggableProps}
            {...p.dragHandleProps}>
            <img
                className={styles.menu01Icon}
                loading="eager"
                alt=""
                src="/assets/images/reorder-ic.svg"
            />
            <div className={styles.referencetitleAndOrder}>
                <h2 className={styles.referencetitle}>{title}</h2>
                <p className={styles.order}>{order}</p>
            </div>
        </div>
    );
});

export default ReOrderItem;
