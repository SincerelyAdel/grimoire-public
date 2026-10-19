**`uvm_reg_hw_reset_seq`** — built-in register test sequences (`uvm_reg_*_seq`, `uvm_mem_*_seq`)

The register layer ships ready-made sequences that test a whole block without any register-specific code. `uvm_reg_hw_reset_seq` reads every register and compares it with the reset value in the model. Running these early catches wrong addresses, wrong reset values and wrong access policies in either the RTL or the register description.

**The built-in sequences**

| Sequence | What it checks |
| --- | --- |
| `uvm_reg_hw_reset_seq` | Reset values: reads every register after reset and compares with the model |
| `uvm_reg_bit_bash_seq` | Each bit of each register: writes 1 and 0 and checks the result against the access policy |
| `uvm_reg_access_seq` | Each register: frontdoor write then backdoor read, and the reverse |
| `uvm_reg_mem_access_seq` | The access test for registers and memories together |
| `uvm_reg_shared_access_seq` | Registers reachable through several maps: write through one, read through the others |
| `uvm_mem_walk_seq` | Memories: walking pattern across every location |
| `uvm_mem_access_seq` | Memories: frontdoor against backdoor |
| `uvm_reg_mem_built_in_seq` | Runs all of the above |
| `uvm_reg_mem_hdl_paths_seq` | That every backdoor HDL path resolves |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    uvm_reg_hw_reset_seq reset_seq = uvm_reg_hw_reset_seq::type_id::create("reset_seq");
    uvm_reg_bit_bash_seq bash_seq  = uvm_reg_bit_bash_seq::type_id::create("bash_seq");

    phase.raise_objection(this);
    wait_for_reset();

    reset_seq.model = env.regmodel;
    reset_seq.start(null);

    bash_seq.model = env.regmodel;
    bash_seq.start(null);
    phase.drop_objection(this);
endtask
```

**Excluding registers**

Some registers cannot be tested generically, for example a status register that changes by itself. Exclude them with a resource on the register's or block's full name:

```systemverilog
uvm_resource_db #(bit)::set({"REG::", env.regmodel.status.get_full_name()},
                            "NO_REG_TESTS", 1, this);
```

| Resource name | Skips |
| --- | --- |
| `NO_REG_TESTS` | Every built-in test |
| `NO_REG_HW_RESET_TEST` | The reset test |
| `NO_REG_BIT_BASH_TEST` | The bit-bash test |
| `NO_REG_ACCESS_TEST` | The access test |
| `NO_MEM_TESTS`, `NO_MEM_WALK_TEST`, `NO_MEM_ACCESS_TEST` | Memory tests |

**Notes**

- The access and HDL-path sequences need backdoor paths to be defined in the model.
- `uvm_reg_hw_reset_seq` resets the model itself and expects the DUT to be freshly out of reset; override its `reset_blk` task to apply the reset.

**See also**: `uvm_reg_sequence`, `uvm_reg_block`, `uvm_reg`, `uvm_mem`, `uvm_resource_db`
