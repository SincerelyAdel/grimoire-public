**`get_is_active`** — ask an agent whether it is active or passive

A virtual function of `uvm_agent` that returns the agent's mode. The default implementation returns the `is_active` property. Use it, instead of reading the variable, from code outside the agent, and inside the agent if a derived class might override the decision.

**Signature**

```systemverilog
virtual function uvm_active_passive_enum get_is_active();
```

**Overriding it**

An agent whose mode comes from its own configuration object can redefine the function, and everything that asks keeps working:

```systemverilog
class fifo_wr_agent extends uvm_agent;
    fifo_agent_cfg cfg;

    virtual function uvm_active_passive_enum get_is_active();
        return cfg.active ? UVM_ACTIVE : UVM_PASSIVE;
    endfunction
endclass
```

**Notes**

- The answer is only meaningful after the agent's `build_phase` has started, since that is when `is_active` is read from the configuration database.
- Compare against the enum values, not against 0 and 1, for readability.

**See also**: `is_active`, `uvm_agent`, `UVM_ACTIVE`, `UVM_PASSIVE`, `uvm_active_passive_enum`

---

**Coding example**

```systemverilog
// Environment: wire the virtual sequencer only to agents that have a sequencer
function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    if (wr_agt.get_is_active() == UVM_ACTIVE) vsqr.wr_sqr = wr_agt.sqr;
    if (rd_agt.get_is_active() == UVM_ACTIVE) vsqr.rd_sqr = rd_agt.sqr;
endfunction

// Test: do not start stimulus on a passive agent
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    if (env.wr_agt.get_is_active() == UVM_ACTIVE)
        wr_seq.start(env.wr_agt.sqr);
    phase.drop_objection(this);
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
