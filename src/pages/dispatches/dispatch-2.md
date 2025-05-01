---
layout: ../../layouts/MarkdownDispatchLayout.astro
title: 'So how the deployment happened?'
date: '2025-04-08'
time: '11:00'
description: 'A brief overview of the deployment process and some challenges faced'
---
So how the deployment happened?

[This](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) page basically was everything I needed. Then I saw that nothing happened, just breathe, let it do it's thing hit refresh a couple of times and come back again you'll see the deployment working. I had to watch a youtube video to confirm that I did everything right, but you don't lol.

Random apparently if you deploy your repo from the root it will display your README file, did not know about that but it led me to my next action.

I wanted to make a first version at least to contain all of my written dispatches in the worst way possible so I just added links in my README to my files, then the links were not working in the README, it took me some error and trials in the following format:

`/dispatches/dispatch#0.md`
`dispatches/dispatch#0.md`
`./dispatches/dispatch#0.md`

And then I gave up since it was not working, did a prompt and funny enough apparently the character `#` needed to be encoded in the URL as `%23`, did that then it worked, so the more you know!

Then I was like, alright I better be write about this in my next dispatch, so here is me doing that haha. I should probably have a way of organizing all these learnings somehow by one so that it would be clearer for you the reader, or I could just ignore it for now, anyways.

dispatch_output: character # have to be encoded as %23 in URLs.
