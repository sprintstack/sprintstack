package com.mowforth.rhinode.core.io;

import static org.jboss.netty.channel.Channels.*;

import org.jboss.netty.channel.ChannelPipeline;
import org.jboss.netty.channel.ChannelPipelineFactory;

public class INetServerPipelineFactory implements ChannelPipelineFactory {

    public ChannelPipeline getPipeline() {
        ChannelPipeline pipeline = pipeline();
        pipeline.addLast("handler", new INetServerHandler());
        return pipeline;
    }

}
