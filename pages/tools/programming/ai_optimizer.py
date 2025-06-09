# ai_optimizer.py
import openai
import astor
import ast

def optimize_code(code, language):
    """Use AI to suggest optimized code"""
    prompt = f"""
    Optimize this {language} code for better performance and readability.
    Return only the optimized code without explanations.
    
    Original code:
    {code}
    """

    response = openai.Completion.create(
        engine="code-davinci-002",
        prompt=prompt,
        temperature=0.3,
        max_tokens=2000
    )

    return response.choices[0].text.strip()

def analyze_ast(code, language):
    """Static analysis for language-specific optimizations"""
    if language == "python":
        tree = ast.parse(code)
        # Implement custom optimizations
        return astor.to_source(tree)
    return code