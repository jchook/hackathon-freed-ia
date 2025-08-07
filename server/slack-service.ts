import { WebClient } from '@slack/web-api';
import type { FeedItem } from '../shared/schema';

interface SlackConfig {
  token?: string;
  channel?: string;
}

class SlackService {
  private client?: WebClient;
  private channel: string;

  constructor(config: SlackConfig) {
    // Initialize Slack client if token is provided
    if (config.token) {
      this.client = new WebClient(config.token);
    }
    
    // Default channel or use configured one
    this.channel = config.channel || '#competitive-intel';
  }

  async sendFeedAlert(feedItem: FeedItem) {
    if (!this.client) {
      console.log('Slack not configured - would send message:', this.formatMessage(feedItem));
      return { success: false, reason: 'Slack not configured' };
    }

    try {
      const message = this.formatMessage(feedItem);
      
      const result = await this.client.chat.postMessage({
        channel: this.channel,
        text: message.text,
        blocks: message.blocks,
      });

      return { success: true, ts: result.ts };
    } catch (error) {
      console.error('Failed to send Slack message:', error);
      return { success: false, error };
    }
  }

  async sendInsightAlert(insight: any) {
    if (!this.client) {
      console.log('Slack not configured - would send insight:', this.formatInsightMessage(insight));
      return { success: false, reason: 'Slack not configured' };
    }

    try {
      const message = this.formatInsightMessage(insight);
      
      const result = await this.client.chat.postMessage({
        channel: this.channel,
        text: message.text,
        blocks: message.blocks,
      });

      return { success: true, ts: result.ts };
    } catch (error) {
      console.error('Failed to send Slack insight message:', error);
      return { success: false, error };
    }
  }

  private formatMessage(feedItem: FeedItem) {
    const sourceEmoji = this.getSourceEmoji(feedItem.source);
    const tagsText = feedItem.tags && feedItem.tags.length > 0 
      ? feedItem.tags.map(tag => `#${tag}`).join(' ')
      : '';
    
    const text = `${sourceEmoji} New competitive intel: ${feedItem.title}`;
    
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${sourceEmoji} ${feedItem.title}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: feedItem.content
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Source:*\n${feedItem.source}`
          },
          {
            type: "mrkdwn",
            text: `*Published:*\n${new Date(feedItem.publishedAt).toLocaleDateString()}`
          },
          ...(tagsText ? [{
            type: "mrkdwn",
            text: `*Tags:*\n${tagsText}`
          }] : []),
          {
            type: "mrkdwn",
            text: `*Link:*\n<${feedItem.sourceUrl}|View Source>`
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `🤖 *ScribeArena* competitive intelligence alert • ${new Date().toLocaleString()}`
          }
        ]
      }
    ];

    return { text, blocks };
  }

  private getSourceEmoji(source: string): string {
    const sourceEmojis: Record<string, string> = {
      "heidi": "🩺",
      "freed": "📝", 
      "sunoh": "🔊",
      "abridge": "🌉",
      "deepscribe": "📋",
      "suki": "🤖",
      "ambience": "🏥",
      "nabla": "⚡",
      "nuance": "🎤",
      "market": "📊",
      "research": "🔬"
    };
    
    return sourceEmojis[source.toLowerCase()] || "📰";
  }

  private formatInsightMessage(insight: any) {
    const impactEmoji = this.getImpactEmoji(insight.impact);
    const mentionsText = insight.mentions && insight.mentions.length > 0 
      ? insight.mentions.join(' ')
      : '';
    
    const text = `${impactEmoji} Strategic Insight: ${insight.title} ${mentionsText}`;
    
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${impactEmoji} Strategic Insight Generated`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${insight.title}*\n${insight.summary}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Impact:* ${insight.impact.toUpperCase()}`
          },
          {
            type: "mrkdwn", 
            text: `*Categories:* ${insight.categories.join(', ')}`
          }
        ]
      }
    ];

    // Add insights sections
    const insightCategories = Object.entries(insight.insights || {}).filter(([_, items]) => items && items.length > 0);
    if (insightCategories.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Key Insights:*"
        }
      });

      insightCategories.forEach(([category, items]) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${category.toUpperCase()}:*\n${(items as string[]).map(item => `• ${item}`).join('\n')}`
          }
        });
      });
    }

    // Add action items
    if (insight.actionItems && insight.actionItems.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Action Items:*"
        }
      });

      insight.actionItems.forEach((action: any, index: number) => {
        const priorityEmoji = action.priority === 'high' ? '🔴' : action.priority === 'medium' ? '🟡' : '🟢';
        const assignee = action.assignee || 'Unassigned';
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${priorityEmoji} *${action.category}:* ${action.action}\n*Assignee:* ${assignee}`
          }
        });
      });
    }

    // Add mentions and footer
    if (mentionsText) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Mentions:* ${mentionsText}`
        }
      });
    }

    blocks.push({
      type: "divider"
    });
    
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `🧠 *ScribeArena* competitive intelligence insights • ${new Date().toLocaleString()}`
        }
      ]
    });

    return { text, blocks };
  }

  private getImpactEmoji(impact: string): string {
    const impactEmojis: Record<string, string> = {
      "high": "🚨",
      "medium": "⚠️", 
      "low": "ℹ️"
    };
    
    return impactEmojis[impact.toLowerCase()] || "📊";
  }
}

// Export singleton instance
const slackConfig: SlackConfig = {
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SLACK_CHANNEL || '#competitive-intel'
};

export const slackService = new SlackService(slackConfig);