# X Video Downloader Workflow

A GitHub Action to download X (Twitter) videos directly into your workflows. Powered by [X (Twitter) Video Downloader](https://x-downloader.com).

## Inputs

- `video_url`: The X video URL to download (required).

## Outputs

- `download_url`: The URL to the downloaded video.

## Example Usage

```yaml
name: Download X (Twitter) Video
on: [push]
jobs:
  download:
    runs-on: ubuntu-latest
    steps:
      - uses: your-username/x-video-downloader-workflow@v1
        id: downloader
        with:
          video_url: "https://x.com/username/status/123456789"
      - run: echo "Video downloaded at ${{ steps.downloader.outputs.download_url }}"
```
