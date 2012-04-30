package com.mowforth.rhinode.core.io;

import static org.jboss.netty.channel.Channels.*;

import org.jboss.netty.channel.ChannelPipeline;
import org.jboss.netty.channel.ChannelPipelineFactory;
import org.jboss.netty.handler.codec.frame.DelimiterBasedFrameDecoder;
import org.jboss.netty.handler.codec.frame.Delimiters;
import org.jboss.netty.handler.codec.string.StringDecoder;
import org.jboss.netty.handler.codec.string.StringEncoder;

public class INetServerPipelineFactory implements ChannelPipelineFactory {

    public ChannelPipeline getPipeline() {
        ChannelPipeline pipeline = pipeline();

        pipeline.addLast("framer", new DelimiterBasedFrameDecoder(8192,
                                                                  Delimiters.lineDelimiter()));
        pipeline.addLast("decoder", new StringDecoder());
        pipeline.addLast("encoder", new StringEncoder());

        pipeline.addLast("handler", new INetServerHandler());
        return pipeline;
    }

}
