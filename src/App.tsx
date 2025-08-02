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


export function App() {
    const {downloadStatus, messageHistory} = useTypedSelector(state => state.llm);
    const [hasWebGPU, setHasWebGPU] = useState(true);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!("gpu" in navigator)) {
            setHasWebGPU(false);
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
                <Toolbar>
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
                maxWidth: '1200px !important'
            }}>
                <Box sx={{flexGrow: 1, overflowY: 'auto', py: 2}}>
                    <Box sx={{textAlign: 'center', mb: 2}}>
                        <Button variant="contained" color="primary"
                                onClick={() => downloadModel('Llama-3.2-1B-Instruct-q4f16_1-MLC')}>Download
                            Model</Button>
                    </Box>
                    {!hasWebGPU && (
                        <Typography color="error" sx={{mb: 2}}>
                            Warning: WebGPU is not available. WebLLM will use WASM fallback (much slower).
                        </Typography>
                    )}
                    <Typography>{downloadStatus}</Typography>
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
                <Paper component="form" onSubmit={submitPrompt}
                       sx={{
                           p: '2px 4px',
                           display: 'flex',
                           alignItems: 'center',
                           mt: 2,
                           mb: 4,
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
            </Container>
        </ThemeProvider>
    )
}
