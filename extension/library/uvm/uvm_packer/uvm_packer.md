**`uvm_packer`** — policy for converting an object to and from a stream of bits

Used by `pack()`, `pack_bytes()`, `pack_ints()` and the matching `unpack` methods. It serialises the fields of an object into a bit, byte or int array in a defined order, and rebuilds them on the other side. Typical uses are driving a serial protocol from a structured transaction and passing transactions across a language boundary.

**Settings**

| Field | Default | Meaning |
| --- | --- | --- |
| `big_endian` | 1 | Pack the most significant bit of each field first |
| `physical` / `abstract` | 1 / 0 | Which flagged fields to include |
| `use_metadata` | 0 | Add size information for dynamic arrays, queues and strings so they can be unpacked |
| `policy` | `UVM_DEFAULT_POLICY` | Deep or shallow packing of nested objects |

**Methods used in `do_pack` / `do_unpack`**

```systemverilog
virtual function void pack_field_int(logic [63:0] value, int size);
virtual function void pack_field    (uvm_bitstream_t value, int size);
virtual function void pack_string   (string value);
virtual function void pack_object   (uvm_object value);

virtual function logic [63:0]    unpack_field_int(int size);
virtual function uvm_bitstream_t unpack_field    (int size);
virtual function string          unpack_string   (int num_chars = -1);
virtual function void            unpack_object   (uvm_object value);
```

**Example**

```systemverilog
virtual function void do_pack(uvm_packer packer);
    super.do_pack(packer);
    packer.pack_field_int(data, 8);
    packer.pack_field_int(legal, 1);
endfunction

virtual function void do_unpack(uvm_packer packer);
    super.do_unpack(packer);
    data  = packer.unpack_field_int(8);
    legal = packer.unpack_field_int(1);
endfunction

// Usage
bit          bits[];
byte unsigned bytes[];
int n_bits = tr.pack(bits);
void'(tr.pack_bytes(bytes));
void'(rx_tr.unpack_bytes(bytes));
```

**Notes**

- `pack()` returns the number of bits packed.
- Pack and unpack order must be identical, field for field.
- The `` `uvm_pack_int ``, `` `uvm_pack_enum `` and `` `uvm_unpack_int `` macros are faster shortcuts for the same calls.

**See also**: `do_pack`, `uvm_object`, `uvm_comparer`, `uvm_field_int`
