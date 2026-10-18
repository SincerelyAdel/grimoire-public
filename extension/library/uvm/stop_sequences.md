**`stop_sequences`** — kill every sequence running on a sequencer

A sequencer method that terminates all sequences currently running on it, clears its request and lock queues, and leaves it ready to accept new sequences. Its main use is reset handling: when reset asserts mid-test, in-flight stimulus must be abandoned.

**Signature**

```systemverilog
virtual function void stop_sequences();
```

**Example**

```systemverilog
// Test: restart stimulus whenever reset asserts
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    fork
        forever begin
            fork
                begin
                    @(posedge vif.rst_n);
                    main_seq = fifo_wr_seq::type_id::create("main_seq");
                    main_seq.start(env.wr_agt.sqr);
                end
                @(negedge vif.rst_n);
            join_any
            disable fork;
            env.wr_agt.sqr.stop_sequences();       // clean up whatever was running
        end
        #100us;
    join_any
    disable fork;
    phase.drop_objection(this);
endtask

// Driver: abandon the current item on reset
task run_phase(uvm_phase phase);
    forever begin
        fork
            drive_loop();
            @(negedge vif.rst_n);
        join_any
        disable fork;
        vif.wr_drv_cb.wr_en <= 1'b0;
        @(posedge vif.rst_n);
    end
endtask
```

**Notes**

- The driver must be reset consistently. If the driver was between `get_next_item` and `item_done` when the sequences were stopped, its next `get_next_item` is reported as an error unless the driver's loop is restarted, as above. In UVM 1.1d, `stop_sequences` clears the sequencer's own "item in progress" state.
- A killed sequence does not run `post_body` or `post_start`, and objections it raised are not dropped for it. Keep objections in the test, not in sequences that may be killed.
- To stop a single sequence, call `seq.kill()`.
- Stopping the sequences on a virtual sequencer does not stop the sub-sequences they started on other sequencers; stop those sequencers too.

**See also**: `uvm_sequencer`, `uvm_sequence_base`, `grab`, `reset_phase`, `get_next_item`
