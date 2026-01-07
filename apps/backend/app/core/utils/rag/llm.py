from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.schemas.rag import LlmQuery


def llm_response(input_data: LlmQuery):
    # system prompt to guide llm behavior
    system_message = SystemMessage(
        content="""You are a helpful document assistant.
INSTRUCTIONS:
1. Answer questions based ONLY on the provided document context
2. If the answer isn't in the context, clearly state "I don't have enough information in the provided documents to answer that"
3. When answering, cite relevant parts of the context when possible
4. Be concise but complete in your responses
5. If asked about previous conversation, use the session history provided
6. Stay professional and helpful in tone
Remember: Stay within the document scope. Don't make assumptions beyond what's explicitly stated in the context."""
    )

    # document context message which is related to user query
    doc_message = HumanMessage(
        content=f"""DOCUMENT CONTEXT:
  {input_data.doc_data}

Please use the above context to answer the following question."""
    )

    # user query message
    user_message = HumanMessage(content=f"[Current Question]: {input_data.query}")

    message = [system_message, doc_message, user_message]

    # optional history context; if chatting with existing chat session from previous interactions
    if input_data.history:
        for idx, i in enumerate(input_data.history, 1):
            if i.role == "user":
                message.insert(
                    -1, HumanMessage(content=f"[Previous Question {idx}]: {i.content}")
                )
            else:
                message.insert(
                    -1, SystemMessage(content=f"[Previous Answer {idx}]: {i.content}")
                )

    # optional session memory context; the context of whole session
    if input_data.context:
        memory_message = SystemMessage(content=f"SESSION MEMORY:\n{input_data.context}")
        message.insert(-1, memory_message)

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    res = llm.invoke(message)
    return res.content


def generate_session_name(context: str) -> str:
    context_message = SystemMessage(
        content="Generate a short and relevant session name based on the following context. Return ONLY the title text, no quotes, no explanations, no additional formatting."
    )
    user_message = HumanMessage(content=f"Context: {context}")
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    res = llm.invoke([context_message, user_message])
    content = res.content if isinstance(res.content, str) else str(res.content)
    return content.strip().strip('"').strip("'")
