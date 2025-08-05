import {downloadModel, sendPrompt} from "./LLM.ts";
import {useEffect, useState} from "react";
import {useTypedDispatch, useTypedSelector} from "./redux/store.ts";
import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme
} from "@mui/material";
import {Send} from "@mui/icons-material";
import Markdown from "react-markdown";
import {setCriticalError, setMessageHistory} from "./redux/llmSlice.ts";
import {isWebGPUok} from "./CheckWebGPU.ts";

const models = [
    'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    'Phi-3-mini-128k-instruct-q4f16_1-MLC',
    'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    'gemma-2-2b-it-q4f16_1-MLC',
    'Qwen2-1.5B-Instruct-q4f16_1-MLC',
];

const MODEL_SIZE_MB = 664;

export function App() {
    const {downloadStatus, messageHistory, criticalError} = useTypedSelector(state => state.llm);
    const dispatch = useTypedDispatch();
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const [alreadyFromCache, setAlreadyFromCache] = useState(false);
    const [loadFinished, setLoadFinished] = useState(false);

    useEffect(() => {
        isWebGPUok().then(trueOrError => {
                if (trueOrError !== true) {
                    dispatch(setCriticalError('WebGPU error: ' + trueOrError));
                }
            }
        )
        if (!('caches' in window)) {
            dispatch(setCriticalError('Cache API is not supported in your browser'));
        }
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                if (estimate && estimate.quota && estimate.usage) {
                    const remainingMb = (estimate.quota - estimate.usage) / 1024 / 1024;
                    if (!alreadyFromCache && remainingMb > 10 && remainingMb < MODEL_SIZE_MB) {
                        dispatch(setCriticalError('Remaining cache storage, that browser allowed is too low'));
                    }
                }
            });
        } else {
            dispatch(setCriticalError('StorageManager API is not supported in your browser'));
        }
    }, [dispatch]);

    useEffect(() => {
        setLoadFinished(false);
        const downloadedModelsJson = localStorage.getItem('downloaded_models');
        if (downloadedModelsJson) {
            const downloadedModels = JSON.parse(downloadedModelsJson);
            if (downloadedModels.includes(selectedModel)) {
                setAlreadyFromCache(true);
                downloadModel(selectedModel).then(() => setLoadFinished(true));
            } else {
                setAlreadyFromCache(false);
            }
        } else {
            setAlreadyFromCache(false);
        }
    }, [selectedModel, dispatch]);

    function submitPrompt(e: { preventDefault: () => void; }) {
        e.preventDefault();
        sendPrompt(inputValue);
        setInputValue('');
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar sx={{
                    maxWidth: '1200px !important',
                    margin: '0 auto',
                }}>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        BrowserLLM
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                paddingBottom: '100px',
                maxWidth: '1200px !important'
            }}>
                <h1>Browser LLM demo working on JavaScript and WebGPU</h1>
                <Box sx={{flexGrow: 1, overflowY: 'auto', py: 2}}>
                    {!alreadyFromCache && !loadFinished && !criticalError && (
                        <Box sx={{textAlign: 'center', mb: 2}}>
                            <FormControl sx={{m: 1, minWidth: 220}}>
                                <InputLabel id="demo-simple-select-helper-label">Model</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={selectedModel}
                                    label="Model"
                                    onChange={(e) => {
                                        setSelectedModel(e.target.value);
                                        dispatch(setMessageHistory([]));
                                    }}
                                >
                                    {models.map(model => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary"
                                    onClick={() => downloadModel(selectedModel).then(() => setLoadFinished(true))}>Download
                                Model ({MODEL_SIZE_MB}MB)</Button>
                        </Box>
                    )}
                    <Typography>Loading model: {downloadStatus}</Typography>
                    {criticalError && (
                        <Typography color="error" sx={{mb: 2}}>{criticalError}</Typography>
                    )}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {messageHistory.map((message, i) => (
                            <Paper
                                key={i}
                                sx={{
                                    p: 1.5,
                                    maxWidth: '80%',
                                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                                }}
                            >
                                <Typography
                                    variant="body2" sx={{color: 'text.secondary', mb: 0.5}}>{message.role}:</Typography>
                                {/* @ts-ignore */}
                                <Markdown>{message.content}</Markdown>
                            </Paper>
                        ))}
                    </Box>
                </Box>

                {!criticalError && (
                    <Box sx={{
                        position: messageHistory.length > 0 ? 'fixed' : 'static',
                        bottom: messageHistory.length > 0 ? 0 : 'auto',
                        left: 0,
                        right: 0,
                        bgcolor: 'background.default',
                        p: 2,
                    }}>
                        <Paper component="form" onSubmit={submitPrompt}
                               sx={{
                                   p: '2px 4px',
                                   display: loadFinished ? 'flex' : 'none',
                                   alignItems: 'center',
                                   mx: 'auto',
                                   width: '100%',
                                   maxWidth: '1200px'
                               }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                sx={{ml: 1, flex: 1}}
                                InputProps={{disableUnderline: true}}
                            />
                            <IconButton type="submit" sx={{p: '10px'}} aria-label="send">
                                <Send/>
                            </IconButton>
                        </Paper>
                    </Box>
                )}
            </Container>
            <a className="github-fork-ribbon" target='_blank' href="https://github.com/andreinwald/browser-llm"
               data-ribbon="Fork me on GitHub"
               title="Fork me on GitHub">Fork me on GitHub</a>
        </ThemeProvider>
    )
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#333',
            paper: '#444',
        },
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
});

