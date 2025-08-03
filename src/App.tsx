import {downloadModel, sendPrompt} from "./LLM.ts";
import {useEffect, useState} from "react";
import {useTypedSelector} from "./redux/store.ts";
import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    IconButton,
    Paper,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme
} from "@mui/material";
import {Send} from "@mui/icons-material";
import Markdown from "react-markdown";

const MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
const MODEL_SIZE_MB = 664;

export function App() {
    const {downloadStatus, messageHistory} = useTypedSelector(state => state.llm);
    const [inputValue, setInputValue] = useState('');
    const [alreadyDownloaded, setAlreadyDownloaded] = useState(false);
    const [loadFinished, setLoadFinished] = useState(false);
    const [criticalError, setCriticalError] = useState<string | false>(false);

    useEffect(() => {
        if (!("gpu" in navigator)) {
            setCriticalError('WebGPU is not available. We will use CPU fallback (much slower)');
        }
        if (!('caches' in window)) {
            setCriticalError('Cache API is not supported in your browser');
        }
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                if (estimate) {
                    const remainingMb = (estimate.quota - estimate.usage) / 1024 / 1024;
                    if (!alreadyDownloaded && remainingMb > 10 && remainingMb < MODEL_SIZE_MB) {
                        setCriticalError('Remaining cache storage, that browser allowed is too low');
                    }
                }
            });
        } else {
            setCriticalError('StorageManager API is not supported in your browser');
        }

        if (localStorage.getItem('downloaded_models')) {
            setAlreadyDownloaded(true);
            downloadModel(MODEL).then(() => setLoadFinished(true));
        }

    }, []);

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
                    {!alreadyDownloaded && !loadFinished && (
                        <Box sx={{textAlign: 'center', mb: 2}}>
                            <Button variant="contained" color="primary"
                                    onClick={() => downloadModel(MODEL).then(() => setLoadFinished(true))}>Download
                                Model ({MODEL_SIZE_MB}MB)</Button>
                        </Box>
                    )}
                    {criticalError && (
                        <Typography color="error" sx={{mb: 2}}>{criticalError}</Typography>
                    )}
                    <Typography>Loading model: {downloadStatus}</Typography>
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
