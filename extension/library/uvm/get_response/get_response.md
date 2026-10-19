**`get_response`** — collect a response from the driver, in a sequence

Called in a sequence after `finish_item()` when the driver returns a separate response object. It blocks until a response is available in this sequence's response queue and returns it.

**Signature**

```systemverilog
virtual task get_response(output RSP response, input int transaction_id = -1);
```

| Argument | Meaning |
| --- | --- |
| `response` | Receives the response object |
| `transaction_id` | `-1` returns the next response in order; a specific ID waits for the response to that request |

**Example**

```systemverilog
task body();
    repeat (n_items) begin
        req = fifo_transaction::type_id::create("req");
        start_item(req);
        void'(req.randomize());
        finish_item(req);

        get_response(rsp);
        if (!rsp.legal)
            `uvm_info("FIFO_WR_SEQ", "write was rejected: FIFO full", UVM_MEDIUM)
    end
endtask
```

Out-of-order responses in a pipelined protocol:

```systemverilog
start_item(req_a); finish_item(req_a);
start_item(req_b); finish_item(req_b);
get_response(rsp, req_b.get_transaction_id());   // wait for b specifically
get_response(rsp, req_a.get_transaction_id());
```

**How routing works**

The driver must call `rsp.set_id_info(req)` before returning the response. That copies the sequence ID, which the sequencer uses to find the right sequence, and the transaction ID, which `get_response` can match on.

**Notes**

- If the driver sends no responses, `get_response` blocks forever. If the driver sends responses and the sequence never collects them, the queue overflows: "Response queue overflow, response was dropped".
- The queue depth is 8 by default; change it with `set_response_queue_depth(n)`, where `-1` is unbounded, or silence the overflow error with `set_response_queue_error_report_disabled(1)`.
- For asynchronous handling, call `use_response_handler(1)` and override `response_handler(uvm_sequence_item response)`.
- Many drivers avoid all of this by writing results back into the request object.

**See also**: `item_done`, `rsp_port`, `set_id_info`, `finish_item`, `uvm_sequence`, `uvm_driver`
