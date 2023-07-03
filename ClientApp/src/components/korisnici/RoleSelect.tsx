import Form from "antd/lib/form";
import Select from "antd/lib/select";
import Tag from "antd/lib/tag";
import { Rola, RoleColors } from "../../types/enums/Rola";


function GenerateOptions() {
    return (Object.keys(Rola) as Array<keyof typeof Rola>).map((key) => {
        return {
            value: key,
            label: key
        }
    })
}


function tagRender(props: any) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={RoleColors.get(value)}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 5, }}
        >
            {label}
        </Tag>
    );
}

function RoleSelect({ disabled }: {disabled:boolean}) {
    return (
        <Form.Item
            label="Role"
            name="role"
        >
            <Select
                mode="multiple"
                showArrow
                placeholder="Dozvole za pristup"
                filterOption={(input, option) => {
                    if (option?.label) {
                        return option.label.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    return false;
                }}
                tagRender={tagRender}
                style={{ width: '100%' }}
                options={GenerateOptions()}
                disabled={disabled}
            />
        </Form.Item>
    )
}

export default RoleSelect;
