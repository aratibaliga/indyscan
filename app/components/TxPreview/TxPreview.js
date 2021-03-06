import React, {Component} from "react";
import "./TxPreview.scss";
import {Table, Item, Grid} from 'semantic-ui-react'
import {txCodeToTxType} from "../../data/tx-types";
import Link from "next/link";

class TxPreview extends Component {
    render() {
        const {seqNo, type, timestamp, txnId, rootHash} = this.props.txInfo;
        const {baseUrl, network, txType} = this.props;
        const href = `${baseUrl}/tx?network=${network}&txType=${txType}&seqNo=${seqNo}`;
        const as = `/tx/${network}/${txType}/${seqNo}`;
        return (
                <Item style={{marginBottom: "2em"}}>
                    <Item.Image size='tiny'>
                       <Link href={href} as={as}><a><span style={{fontSize: "2.5em"}}>{seqNo}</span></a></Link>
                    </Item.Image>
                    <Item.Content>
                        <Item.Header>{txCodeToTxType(type)}</Item.Header>
                        <Item.Meta>{timestamp}</Item.Meta>
                        <Item.Description>{`${rootHash.substring(0, 28)}`}</Item.Description>
                    </Item.Content>
                </Item>

        );
    }
}

export default TxPreview;
