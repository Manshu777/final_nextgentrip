ALTER TABLE bookflights
ADD cancelled_at DATETIME NULL,
ADD cancellation_remarks TEXT NULL,
ADD refund_amount DECIMAL(10,2) NULL,
ADD refund_status VARCHAR(255) NULL,
ADD refund_initiated_at DATETIME NULL;