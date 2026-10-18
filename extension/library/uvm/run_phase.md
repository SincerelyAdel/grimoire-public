**`run_phase`** — the task phase in which the testbench consumes simulation time

The main time-consuming phase. Every component's `run_phase` task is started in parallel at time 0. Drivers and monitors run endless loops in it, and the test uses it to start sequences. It is the only time-consuming phase most testbenches need.

**Signature**

```systemverilog
virtual task run_phase(uvm_phase phase);
```

**How it ends**

The phase lasts as long as at least one objection is raised. When the last objection is dropped (and any drain time has passed), the phase ends and every `run_phase` task still running is killed, including `forever` loops. If nothing ever raises an objection, the phase ends at time 0 and no stimulus runs.

**Example**

```systemverilog
// Test: owns the objection
task run_phase(uvm_phase phase);
    fifo_wr_seq wr_seq = fifo_wr_seq::type_id::create("wr_seq");
    fifo_rd_seq rd_seq = fifo_rd_seq::type_id::create("rd_seq");

    phase.raise_objection(this, "fifo_test stimulus");
    fork
        wr_seq.start(env.wr_agt.sqr);
        rd_seq.start(env.rd_agt.sqr);
    join
    phase.phase_done.set_drain_time(this, 20);
    phase.drop_objection(this, "fifo_test stimulus");
endtask

// Driver: no objection, just a loop that the end of the phase kills
task run_phase(uvm_phase phase);
    vif.wr_drv_cb.wr_en <= 1'b0;
    @(posedge vif.rst_n);
    forever begin
        seq_item_port.get_next_item(req);
        drive_item(req);
        seq_item_port.item_done();
    end
endtask

// Monitor
task run_phase(uvm_phase phase);
    forever begin
        @(vif.wr_mon_cb iff vif.wr_mon_cb.wr_en);
        tr = fifo_transaction::type_id::create("tr");
        tr.data = vif.wr_mon_cb.data_in;
        ap.write(tr);
    end
endtask
```

**Guidelines**

- Raise the objection before the first time-consuming statement. If time advances first, the phase may already have ended.
- Keep objections in the test, or in a top-level sequence. Raising one per transaction in a driver or monitor is slow.
- Add a drain time when the DUT needs a few cycles to flush results after the last stimulus.
- A scoreboard that must finish processing can delay the end with `phase_ready_to_end`.

**Relation to the run-time phases**

`reset_phase`, `configure_phase`, `main_phase`, `shutdown_phase` and their `pre_`/`post_` forms run at the same time as `run_phase`. `run_phase` does not end until those have all finished, and they do not wait for it unless it holds an objection. Using one style consistently avoids surprises.

**See also**: `raise_objection`, `drop_objection`, `set_drain_time`, `uvm_phase`, `main_phase`, `phase_ready_to_end`, `extract_phase`
