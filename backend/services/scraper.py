import requests
from bs4 import BeautifulSoup
import traceback

def scrape_wikipedia(url: str):
    try:
        headers = {
            'User-Agent': 'WikiQuizApp/1.0 (mailto:admin@example.com)'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Title
        title = soup.find('h1', id='firstHeading').text.strip()
        
        # Content - extract paragraphs
        content_div = soup.find('div', id='mw-content-text')
        paragraphs = content_div.find_all('p')
        
        text_content = ""
        for p in paragraphs:
            text_content += p.get_text() + "\n"
        
        # Basic section extraction (h2)
        sections = []
        for header in content_div.find_all('h2'):
            headline = header.find('span', class_='mw-headline')
            if headline:
                sections.append(headline.text.strip())
                
        # Limit text content to avoid token limits (optimistic truncation)
        return {
            "title": title,
            "text": text_content[:15000], # Limit characters
            "html": soup.prettify()[:50000], # Store raw HTML (truncated safety)
            "sections": sections,
            "url": url
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        traceback.print_exc()
        raise Exception(f"Failed to scrape URL: {str(e)}")
