import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {useTypedDispatch, useTypedSelector} from "./redux/store.ts";
import {setSelectedModel} from "./redux/llmSlice.ts";

export function ModelSelector() {
    const dispatch = useTypedDispatch();
    const {selectedModel, models} = useTypedSelector(state => state.llm);

    return (
        <FormControl fullWidth>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
                labelId="model-select-label"
                id="model-select"
                value={selectedModel}
                label="Model"
                onChange={(e) => dispatch(setSelectedModel(e.target.value))}
            >
                {models.map(model => (
                    <MenuItem key={model.id} value={model.id}>{model.id}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
