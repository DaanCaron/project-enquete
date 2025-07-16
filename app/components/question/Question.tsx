import { useState, useRef, useEffect } from "react"
import { QuestionData } from "../../types"
import questionService from "../../services/QuestionService"
import { View, Text, StyleSheet, Pressable } from "react-native";
import { io } from "socket.io-client";


const socket = io(process.env.EXPO_PUBLIC_SOCKET_SERVER || "http://192.168.0.132:4000");

const Question: React.FC = () => {

    const [question, setQuestion] = useState<QuestionData | null>(null)
    const sequence = useRef(1)
    const survey = useRef(0)
    const qid = useRef(0)

    const handleSelectGraph = () => {
        if (qid.current !== null) {
            const message = JSON.stringify({ type: "selectGraph", qid: qid.current });
            socket.send(message);
        }
    };


    useEffect(() => {
        const selectSurvey = async (sid: number) => {
            if (sid === 0) {
                survey.current = sid
                qid.current = 0
                setQuestion(null);
                handleSelectGraph();
            } else {
                survey.current = sid
                sequence.current = 1;
                const success = await fetchQuestionBySequenceAndSurvey(sequence.current, sid);
                if (success) {
                    handleSelectGraph();
                }
            }
        }
        const nextquestion = async () => {
            if (survey.current === 0) return;

            const nextSequence = sequence.current + 1;
            const success = await fetchQuestionBySequenceAndSurvey(nextSequence, survey.current);

            if (success) {
                sequence.current = nextSequence;
                handleSelectGraph();
            }
        };

        const prevQuestion = async () => {
            if (survey.current === 0 || sequence.current <= 1) return;

            const prevSequence = sequence.current - 1;
            const success = await fetchQuestionBySequenceAndSurvey(prevSequence, survey.current);

            if (success) {
                sequence.current = prevSequence;
                handleSelectGraph();
            }
        };

        const updateQuestion = () => {
            if (survey.current === 0) return;
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        }


        socket.on('nextQuestion', nextquestion);
        socket.on('prevQuestion', prevQuestion);
        socket.on('updateQuestion', updateQuestion);
        socket.on('selectSurvey', selectSurvey)

        if (survey.current !== 0) {
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        }

        return () => {
            socket.off('nextQuestion', nextquestion);
            socket.off('prevQuestion', prevQuestion);
            socket.off('updateQuestion', updateQuestion);
            socket.off('selectSurvey', selectSurvey)
        };
    }, []);

    const fetchQuestionBySequenceAndSurvey = async (sequence: number, survey: number): Promise<boolean> => {
        try {
            const res = await questionService.getQuestionBySequenceAndSurveyId(sequence, survey);
            if (res.ok) {
                const questionData = await res.json();
                qid.current = questionData.id;
                setQuestion(questionData);
                return true;
            }
        } catch (error) {
            console.error(error)
            console.error("Failed to connect to server to get question.");
        }
        return false;
    };
    if (survey.current === 0) {
        return (
            <View style={styles.centeredContainer}>
            </View>
        );
    }
    else if (!question) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.messageText}>Wacht tot een vraag geselecteerd wordt! (Als dit sherm zichtbaar is, is er iets misgelopen in de code)</Text>
            </View>
        );
    }

    const { window } = question;

    const getBoxFontSize = (height: number, width: number): number => {
        const scale = Math.min(width, height) * 0.3
        return Math.max(scale, 10)
    }

    const castVote = async (vote: string) => {
        try {
            const res = await questionService.castVote(question.id, vote)
            if (res.ok) {
                const ansData = await res.json()
                console.log(ansData)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                position: "relative",
                backgroundColor: window.background || "#1a1941"
            }}
        >
            <View
                style={{
                    position: "absolute",
                    display: "flex",
                    backgroundColor: "#ffffff3f",

                    borderStyle: "solid",
                    borderColor: "white",
                    borderWidth: 6,
                    borderRadius: 5,

                    left: window.text.x,
                    top: window.text.y,
                    width: window.text.width,
                    height: window.text.height,

                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text
                    style={{
                        fontSize: getBoxFontSize(window.text.height, window.text.width),
                        color: "white"
                    }}
                >
                    {question.question}
                </Text>
            </View>

            {window.buttons.map((button) => (
    <Pressable
        key={button.id}
        onPress={() => castVote(button.text)}
        style={({ pressed }) => {
            let baseColor = "#ffffff3f";
            let activeColor = "#ffffff3f";

            if (button.text === "Yes" || button.text === "Ja") activeColor = "#bbf7d0"; // Tailwind green-200
            else if (button.text === "No" || button.text === "Nee") activeColor = "#fecaca"; // Tailwind red-200
            else activeColor = "#bfdbfe"; // Tailwind blue-200

            return {
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                left: button.x,
                top: button.y,
                width: button.width,
                height: button.height,
                backgroundColor: pressed ? activeColor : baseColor,
                borderStyle: "solid",
                borderColor:
                    button.text === "Yes" || button.text === "Ja"
                        ? "#22c55e"
                        : button.text === "No" || button.text === "Nee"
                            ? "#ef4444"
                            : "#3b82f6",
                borderWidth: 6,
                borderRadius: 5,
            };
        }}
    >
        <Text
            style={{
                fontSize: getBoxFontSize(window.text.height, window.text.width),
                color: "white",
                fontWeight: "bold"
            }}
        >
            {button.text}
        </Text>
    </Pressable>
))}

        </View>
    )
}

export default Question


const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        color: 'white',
        fontSize: 20, // corresponds to Tailwind's text-xl
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});